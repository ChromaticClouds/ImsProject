package com.example.ims.support;

import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.mysql.MySQLContainer;

/**
 * 실제 MySQL이 필요한 통합 테스트의 기반 클래스.
 *
 * <p>DB는 아래 순서로 정한다.
 * <ol>
 *   <li>환경 변수 {@code IMS_IT_JDBC_URL}(+ {@code IMS_IT_DB_USER}, {@code IMS_IT_DB_PASSWORD})이 있으면 그 DB를 쓴다.
 *       Docker를 쓸 수 없는 환경을 위한 것이다. <b>테스트가 스키마를 create-drop으로 만들고 지우므로
 *       비어 있는 임시 DB만 지정해야 한다.</b></li>
 *   <li>Docker를 쓸 수 있으면 Testcontainers로 MySQL 8.4 컨테이너를 띄운다(CI 기본 경로).</li>
 *   <li>둘 다 없으면 이 테스트들은 건너뛴다.</li>
 * </ol>
 */
@SpringBootTest(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    // 이 테스트들은 Redis·메일·JWT를 쓰지 않지만 설정 값은 필요해서 자리만 채운다.
    "spring.data.redis.host=localhost",
    "spring.data.redis.port=6379",
    "spring.data.redis.username=",
    "spring.data.redis.password=",
    "resend.api-key=re_integration_test",
    "resend.from-email=test@example.com",
    "jwt.secret=integration-test-secret-integration-test-secret-0123456789"
})
@EnabledIf("com.example.ims.support.MySqlIntegrationTest#databaseAvailable")
public abstract class MySqlIntegrationTest {

    private static final String EXTERNAL_URL = System.getenv("IMS_IT_JDBC_URL");

    private static MySQLContainer container;

    static boolean databaseAvailable() {
        return EXTERNAL_URL != null || DockerClientFactory.instance().isDockerAvailable();
    }

    @DynamicPropertySource
    static void database(DynamicPropertyRegistry registry) {
        if (EXTERNAL_URL != null) {
            registry.add("spring.datasource.url", () -> EXTERNAL_URL);
            registry.add("spring.datasource.username", () -> envOrDefault("IMS_IT_DB_USER", "root"));
            registry.add("spring.datasource.password", () -> envOrDefault("IMS_IT_DB_PASSWORD", ""));
            return;
        }

        synchronized (MySqlIntegrationTest.class) {
            if (container == null) {
                container = new MySQLContainer("mysql:8.4");
                container.start();
            }
        }
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
    }

    private static String envOrDefault(String name, String fallback) {
        String value = System.getenv(name);
        return value == null ? fallback : value;
    }
}
