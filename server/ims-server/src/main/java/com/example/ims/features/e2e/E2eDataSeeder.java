package com.example.ims.features.e2e;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.enums.VendorItemStatus;
import com.example.ims.features.vendor.enums.VendorStatus;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Profile("e2e")
@ConditionalOnProperty(prefix = "e2e.seed", name = "enabled", havingValue = "true")
@RequiredArgsConstructor
public class E2eDataSeeder implements ApplicationRunner {

    private static final String E2E_VENDOR_NAME = "E2E 테스트 공급처";
    private static final String E2E_PRODUCT_CODE = "E2E-PRODUCT-001";
    private static final String E2E_PRODUCT_NAME = "E2E 테스트 소주";
    private static final int E2E_PURCHASE_PRICE = 1200;
    private static final int E2E_SALE_PRICE = 1500;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;
    private final VendorItemRepository vendorItemRepository;

    @Value("${e2e.seed.password}")
    private String password;

    @Value("${e2e.seed.first-admin-eid}")
    private String firstAdminEid;

    @Value("${e2e.seed.second-admin-eid}")
    private String secondAdminEid;

    @Value("${e2e.seed.employee-eid}")
    private String employeeEid;

    @Value("${e2e.seed.password-reset-email-domain}")
    private String emailDomain;

    @Override
    public void run(ApplicationArguments args) {
        if (password == null || password.isBlank()) {
            throw new IllegalStateException(
                "E2E_SEED_PASSWORD must be provided when E2E seed is enabled."
            );
        }

        seedUser(firstAdminEid, "E2E 총괄관리자", UserRank.FIRST_ADMIN, UserRole.ALL);
        seedUser(secondAdminEid, "E2E 창고관리자", UserRank.SECOND_ADMIN, UserRole.ALL);
        seedUser(employeeEid, "E2E 사원", UserRank.EMPLOYEE, UserRole.NONE);
        seedPurchaseOrderFixture();
    }

    private void seedUser(
        String eid, String name, UserRank rank, UserRole role
    ) {
        User user = new User();
        user.setEid(eid);
        user.setName(name);
        user.setEmail(eid.toLowerCase() + "@" + emailDomain);
        user.setPassword(passwordEncoder.encode(password));
        user.setUserRank(rank);
        user.setUserRole(role);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    private void seedPurchaseOrderFixture() {
        Vendor vendor = Vendor.builder()
            .type(VendorType.Supplier)
            .vendorName(E2E_VENDOR_NAME)
            .telephone("000-0000-0000")
            .email("e2e-supplier@e2e.invalid")
            .bossName("E2E 공급처 담당자")
            .address("E2E TEST")
            .memo("Disposable E2E fixture")
            .createdAt(LocalDateTime.now())
            .status(VendorStatus.ACTIVE)
            .build();
        vendor = vendorRepository.save(vendor);

        Product product = new Product();
        product.setProductCode(E2E_PRODUCT_CODE);
        product.setName(E2E_PRODUCT_NAME);
        product.setType(ProductType.SOJU);
        product.setBrand("E2E");
        product.setVolume(360);
        product.setPerCount(1);
        product.setSalePrice(E2E_SALE_PRICE);
        product.setCreatedAt(LocalDateTime.now().toString());
        product = productRepository.save(product);

        VendorItem vendorItem = new VendorItem();
        vendorItem.setVendor(vendor);
        vendorItem.setProduct(product);
        vendorItem.setPurchasePrice(E2E_PURCHASE_PRICE);
        vendorItem.setStatus(VendorItemStatus.ACTIVE);
        vendorItemRepository.save(vendorItem);
    }
}
