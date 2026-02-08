package com.example.ims.features.order.dto;

import com.example.ims.features.user.dto.UserIdentifier;
import com.example.ims.features.vendor.dto.VendorIdentifier;

import java.util.List;

public record OrderBootstrap(
    List<UserIdentifier> users,
    List<VendorIdentifier> sellers,
    String sequence
) {}
