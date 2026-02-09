package com.example.ims.features.auth.entities;

import com.example.ims.features.auth.exceptions.InvalidUserStateException;

import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eid;
    private String name;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRank userRank;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    public User register(String name, String password) {
        if (this.status != UserStatus.PENDING) {
            throw new InvalidUserStateException();
        }

        this.name = name;
        this.password = password;
        this.status = UserStatus.ACTIVE;
        return this;
    }

    public void changeRank(UserRank newRank) {
        if (this.userRank == UserRank.FIRST_ADMIN)
            throw new IllegalStateException("최고 관리자는 변경할 수 없습니다.");

        this.userRank = newRank;
        if (newRank != UserRank.EMPLOYEE) this.userRole = UserRole.ALL;
    }

    public void changeRole(UserRole newRole) {
        if (this.userRank != UserRank.EMPLOYEE)
            throw new IllegalStateException("사원만 담당을 변경할 수 있습니다.");

        this.userRole = newRole;
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }
}
