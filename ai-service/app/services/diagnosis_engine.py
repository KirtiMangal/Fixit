import os
import json
import logging
import requests
from app.models.schemas import ProblemDiagnosisRequest, ProblemDiagnosisResponse

logger = logging.getLogger(__name__)

class DiagnosisEngine:
    """
    Intelligent diagnostic reasoning service.
    Uses LLM API if configured via environment variables, with a robust
    heuristic domain engine as a reliable zero-downtime fallback.
    """

    @classmethod
    def diagnose(cls, req: ProblemDiagnosisRequest) -> ProblemDiagnosisResponse:
        # 1. Attempt LLM API if key is present
        api_key = os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                llm_result = cls._call_llm(req, api_key)
                if llm_result:
                    return llm_result
            except Exception as e:
                logger.warning(f"LLM API call failed, falling back to expert heuristic engine: {e}")

        # 2. Expert Heuristic Diagnostic Engine
        return cls._heuristic_diagnosis(req)

    @classmethod
    def _call_llm(cls, req: ProblemDiagnosisRequest, api_key: str) -> ProblemDiagnosisResponse:
        url = os.getenv("LLM_API_URL", "https://api.openai.com/v1/chat/completions")
        model = os.getenv("LLM_MODEL", "gpt-3.5-turbo")

        system_prompt = (
            "You are FixIt AI, an expert technical diagnosis assistant. "
            "Analyze the given problem and return a JSON object with keys: "
            "summary (string), possibleCauses (list of strings, phrased as hypotheses), "
            "recommendedActions (list of strings), severity (LOW, MEDIUM, HIGH, or CRITICAL), "
            "diySuitable (boolean), professionalRecommended (boolean), "
            "safetyWarnings (list of strings). "
            "IMPORTANT: Distinguish possible causes from confirmed diagnosis. "
            "For electrical, vehicle safety, gas, or high-voltage situations, recommend a professional."
        )

        user_content = (
            f"Title: {req.title}\n"
            f"Category: {req.category}\n"
            f"Severity: {req.severity}\n"
            f"Asset info: {req.asset_info or 'None'}\n"
            f"Description: {req.description}"
        )

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        body = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.3,
            "response_format": {"type": "json_object"}
        }

        resp = requests.post(url, headers=headers, json=body, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            return ProblemDiagnosisResponse(**parsed)
        return None

    @classmethod
    def _heuristic_diagnosis(cls, req: ProblemDiagnosisRequest) -> ProblemDiagnosisResponse:
        cat = req.category.upper()
        title_lower = req.title.lower()
        desc_lower = req.description.lower()
        text = f"{title_lower} {desc_lower}"

        possible_causes = []
        recommended_actions = []
        safety_warnings = []
        diy_suitable = True
        professional_recommended = False
        inferred_severity = req.severity or "MEDIUM"

        # Domain Heuristics
        if cat == "LAPTOP":
            if "screen" in text or "flicker" in text or "display" in text:
                possible_causes = [
                    "Worn or loose eDP/LVDS display ribbon cable connecting the motherboard through the hinge.",
                    "Failing LED backlight inverter or display panel damage.",
                    "GPU driver instability or refresh-rate synchronization issue."
                ]
                recommended_actions = [
                    "Test display output by connecting the laptop to an external monitor via HDMI/USB-C.",
                    "Reinstall official graphics drivers in Windows Safe Mode.",
                    "Inspect hinge tension and check if the flickering coincides with specific screen tilt angles."
                ]
                diy_suitable = True
                professional_recommended = False
            elif "heat" in text or "fan" in text or "noise" in text:
                possible_causes = [
                    "Accumulated dust clogging the heatsink exhaust fins.",
                    "Dry or degraded thermal interface material (thermal paste) between CPU/GPU and heatsink.",
                    "Cooling fan bearing wear causing friction and high RPM vibration."
                ]
                recommended_actions = [
                    "Blow compressed air into the exhaust vents in short bursts while holding fan still.",
                    "Elevate laptop on a hard, flat surface to optimize intake airflow.",
                    "Monitor component temperatures with a hardware monitor utility."
                ]
                diy_suitable = True
            elif "battery" in text or "charge" in text or "power" in text:
                possible_causes = [
                    "Lithium-ion battery cell degradation or high cycle count.",
                    "Faulty charging adapter or loose DC-in charging port socket.",
                    "Motherboard power delivery circuit (MOSFET) issue."
                ]
                recommended_actions = [
                    "Generate a battery health report using 'powercfg /batteryreport' in command prompt.",
                    "Test charging with a known-working alternative AC adapter.",
                    "Check DC jack for physical wiggle or heat buildup."
                ]
                diy_suitable = False
                professional_recommended = True
            else:
                possible_causes = [
                    "Operating system software conflict or corrupted system files.",
                    "Thermal throttling due to dust accumulation.",
                    "Internal component wear or loose connector cable."
                ]
                recommended_actions = [
                    "Perform a full diagnostic reboot and check Windows Event Viewer for critical errors.",
                    "Run manufacturer built-in hardware diagnostics (e.g. Dell SupportAssist, Lenovo Vantage).",
                    "Back up essential files to external cloud/drive storage."
                ]

        elif cat == "MOBILE":
            if "battery" in text or "drain" in text or "charge" in text:
                possible_causes = [
                    "Chemical battery aging after exceeding 500+ charge cycles.",
                    "Dust, lint, or oxidized pins inside the USB-C / Lightning charging port.",
                    "Background app execution or corrupt OS cache."
                ]
                recommended_actions = [
                    "Gently inspect and clean charging port using a wooden toothpick and compressed air.",
                    "Check battery health percentage in system settings.",
                    "Try a different MFi/certified charging cable and wall adapter."
                ]
                diy_suitable = True
            else:
                possible_causes = [
                    "Damaged touch digitizer layer or loosened flex cable.",
                    "Cached system glitch or firmware partition error.",
                    "Water or humidity ingress affecting internal sensor boards."
                ]
                recommended_actions = [
                    "Perform a forced hardware restart.",
                    "Test touch response in safe mode or diagnostic dialer menu.",
                    "Avoid charging if moisture is suspected."
                ]

        elif cat == "ELECTRICAL":
            diy_suitable = False
            professional_recommended = True
            inferred_severity = "CRITICAL" if req.severity == "CRITICAL" else "HIGH"
            possible_causes = [
                "Overloaded electrical circuit causing the breaker to trip or outlet to spark.",
                "Loose neutral or ground connection inside junction box causing arcing.",
                "Insulation failure or short circuit inside appliance wiring."
            ]
            recommended_actions = [
                "Immediately shut off the corresponding circuit breaker at the main electrical panel.",
                "Unplug all connected devices from the affected circuit.",
                "Do NOT attempt internal wall wiring repair without certified electrical training."
            ]
            safety_warnings = [
                "DANGER OF FATAL ELECTRIC SHOCK: High voltage (110V-240V) present. Never touch exposed wiring or water near outlets.",
                "FIRE HAZARD: Arcing, sparking, or ozone burning smells require immediate breaker shutoff and certified electrician intervention."
            ]

        elif cat == "PLUMBING":
            if "gas" in text or "heater" in text:
                diy_suitable = False
                professional_recommended = True
                safety_warnings = [
                    "GAS LEAK RISK: If you smell sulfur or rotten eggs, do not flip light switches. Evacuate immediately and contact gas emergency services."
                ]
            else:
                possible_causes = [
                    "Worn rubber washer, O-ring, or cartridge seal inside fixture.",
                    "High municipal water pressure exceeding 80 PSI straining pipe joints.",
                    "Mineral scale buildup or partial drain obstruction."
                ]
                recommended_actions = [
                    "Locate and test the isolation shutoff valve under the affected fixture.",
                    "Inspect visible joints and supply lines for hairline cracking or green oxidation.",
                    "Tighten compression couplings with a wrench, taking care not to strip brass threads."
                ]
                safety_warnings = [
                    "WATER DAMAGE CAUTION: Always locate the main shutoff valve before disassembling any pressurized plumbing fixture."
                ]

        elif cat == "VEHICLE":
            if "brake" in text or "steering" in text or "engine" in text:
                diy_suitable = False
                professional_recommended = True
                inferred_severity = "CRITICAL"
                safety_warnings = [
                    "CRITICAL SAFETY CONCERN: Brake, steering, and fuel system faults compromise vehicle handling and public road safety. Do NOT operate vehicle at highway speeds until inspected by a certified mechanic."
                ]
                possible_causes = [
                    "Worn friction material on brake pads or warped rotor disc surface.",
                    "Low hydraulic brake fluid or moisture contamination in fluid lines.",
                    "Suspension ball joint or tie-rod play."
                ]
                recommended_actions = [
                    "Check brake fluid reservoir level in the engine bay (do not open if engine is hot).",
                    "Have wheels removed and friction pad thickness measured with a micrometer.",
                    "Schedule an authorized workshop inspection."
                ]
            else:
                possible_causes = [
                    "Depleted 12V lead-acid battery voltage or corroded terminal posts.",
                    "Alternator diode failure or slipping serpentine accessory belt.",
                    "Blown auxiliary fuse or faulty relay switch."
                ]
                recommended_actions = [
                    "Test battery open-circuit resting voltage with a multimeter (ideal: 12.6V+).",
                    "Clean oxidized battery terminals with a baking soda and wire brush solution.",
                    "Check fuse box diagram for continuity."
                ]

        elif cat == "HOME_APPLIANCE":
            possible_causes = [
                "Clogged lint filter, drain pump filter, or air circulation baffle.",
                "Thermal fuse tripped due to poor ventilation.",
                "Capacitor or motor relay degradation under cyclic load."
            ]
            recommended_actions = [
                "Unplug the appliance from mains power before any physical inspection.",
                "Clean all accessible removable filters, strainers, and condenser coils.",
                "Verify power outlet delivers steady voltage using another device."
            ]
            safety_warnings = [
                "APPLIANCE SAFETY: Large appliances contain high-voltage capacitors that hold charge even after unplugging. Disconnect power completely."
            ]

        else:
            possible_causes = [
                "Mechanical fatigue or physical wear at stress points.",
                "Component misalignment or missing fastening hardware.",
                "Environmental factors such as moisture, dust, or heat."
            ]
            recommended_actions = [
                "Carefully inspect the item under bright lighting for visible fractures or loose screws.",
                "Check manufacturer maintenance guide for recommended disassembly.",
                "Consult a verified specialist if structural integrity is compromised."
            ]

        summary = (
            f"Preliminary automated analysis for '{req.title}' ({req.category}). "
            f"Based on reported symptoms and equipment profile, the issue points to {possible_causes[0].lower()} "
            f"Please treat these diagnostic results as hypotheses requiring verification."
        )

        return ProblemDiagnosisResponse(
            summary=summary,
            possibleCauses=possible_causes,
            recommendedActions=recommended_actions,
            severity=inferred_severity,
            diySuitable=diy_suitable,
            professionalRecommended=professional_recommended,
            safetyWarnings=safety_warnings
        )
