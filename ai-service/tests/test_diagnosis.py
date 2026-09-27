import unittest
from app.models.schemas import ProblemDiagnosisRequest
from app.services.diagnosis_engine import DiagnosisEngine

class TestDiagnosisEngine(unittest.TestCase):

    def test_electrical_hazard_triage(self):
        req = ProblemDiagnosisRequest(
            title="Wall outlet sparking and burning odor",
            description="Sparking occurred when plugging in an electric kettle, circuit breaker tripped",
            category="ELECTRICAL",
            severity="HIGH",
            asset_info="Kitchen Wall Outlet"
        )
        res = DiagnosisEngine.diagnose(req)

        self.assertTrue(res.professionalRecommended)
        self.assertFalse(res.diySuitable)
        self.assertGreater(len(res.safetyWarnings), 0)
        self.assertTrue(any("SHOCK" in w.upper() or "FIRE" in w.upper() for w in res.safetyWarnings))

    def test_laptop_diy_triage(self):
        req = ProblemDiagnosisRequest(
            title="Laptop fan noisy and running continuously",
            description="Dust accumulated inside exhaust vents causing thermal throttling",
            category="LAPTOP",
            severity="MEDIUM",
            asset_info="Dell XPS 15"
        )
        res = DiagnosisEngine.diagnose(req)

        self.assertTrue(res.diySuitable)
        self.assertIn("Laptop", res.summary)
        self.assertGreater(len(res.possibleCauses), 0)
        self.assertGreater(len(res.recommendedActions), 0)

    def test_vehicle_critical_safety_triage(self):
        req = ProblemDiagnosisRequest(
            title="Brakes grinding and pedal feels soft",
            description="High pitched squeal and delayed stopping response",
            category="VEHICLE",
            severity="CRITICAL",
            asset_info="Honda Civic 2020"
        )
        res = DiagnosisEngine.diagnose(req)

        self.assertTrue(res.professionalRecommended)
        self.assertFalse(res.diySuitable)
        self.assertTrue(any("SAFETY" in w.upper() or "BRAKE" in w.upper() for w in res.safetyWarnings))

if __name__ == '__main__':
    unittest.main()
