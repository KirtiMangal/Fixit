package com.fixit.dto;

import com.fixit.entity.Asset;
import com.fixit.entity.ProblemCategory;

public class AssetSummaryResponse {

    private Long id;
    private String name;
    private ProblemCategory category;
    private String brand;
    private String model;

    public AssetSummaryResponse() {
    }

    public AssetSummaryResponse(Long id, String name, ProblemCategory category, String brand, String model) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.model = model;
    }

    public static AssetSummaryResponse fromEntity(Asset asset) {
        if (asset == null) {
            return null;
        }
        return new AssetSummaryResponse(
                asset.getId(),
                asset.getName(),
                asset.getCategory(),
                asset.getBrand(),
                asset.getModel()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProblemCategory getCategory() {
        return category;
    }

    public void setCategory(ProblemCategory category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
