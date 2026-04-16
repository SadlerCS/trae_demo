package com.example.myapp.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class CsrfService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Map<String, Instant> TOKENS = new ConcurrentHashMap<>();
    private static final long TTL_MILLIS = 10 * 60_000;

    /**
     * Issues a new CSRF token string.
     *
     * @return token
     */
    public static String issueToken() {
        byte[] buf = new byte[32];
        RANDOM.nextBytes(buf);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
        TOKENS.put(token, Instant.now().plusMillis(TTL_MILLIS));
        return token;
    }

    /**
     * Validates a CSRF token.
     *
     * @param token token string
     * @return true if valid
     */
    public static boolean isValid(String token) {
        Instant expireAt = TOKENS.remove(token);
        return expireAt != null && Instant.now().isBefore(expireAt);
    }
}

