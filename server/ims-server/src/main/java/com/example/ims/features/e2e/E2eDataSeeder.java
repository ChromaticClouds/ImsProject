package com.example.ims.features.e2e;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("e2e")
@ConditionalOnProperty(prefix = "e2e.seed", name = "enabled", havingValue = "true")
@RequiredArgsConstructor
public class E2eDataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
}
