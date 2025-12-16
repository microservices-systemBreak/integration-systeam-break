package com.systembreak.apigateway;

import com.systembreak.apigateway.filter.CorrelationIdGlobalFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = SbApiGatewayApplication.class)
public class SbApiGatewayApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Test
    void contextLoads_and_beansPresent() {
        assertThat(context.getBean(CorrelationIdGlobalFilter.class)).isNotNull();
        assertThat(context.containsBean("securityConfig")).isTrue();
    }
}
