package com.example.myapp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public final class CaptchaService {

    private static final Logger log = LoggerFactory.getLogger(CaptchaService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private final Map<String, Entry> store = new ConcurrentHashMap<>();
    private final long ttlMillis = 2 * 60_000;

    /**
     * Generates a captcha image and returns id and base64.
     *
     * @return map with captchaId and imageBase64
     */
    public Map<String, String> generateCaptcha() {
        String code = randomCode(5);
        BufferedImage image = render(code);
        String base64 = encode(image);
        String id = UUID.randomUUID().toString();
        store.put(id, new Entry(code, Instant.now().plusMillis(ttlMillis)));
        log.debug("Captcha generated id={}", id);
        return Map.of("captchaId", id, "imageBase64", base64);
    }

    /**
     * Validates captcha against stored code.
     *
     * @param id captcha id
     * @param code user provided code
     * @return true if valid
     */
    public boolean validate(final String id, final String code) {
        Entry entry = store.remove(id);
        if (entry == null) {
            return false;
        }
        if (Instant.now().isAfter(entry.expireAt)) {
            return false;
        }
        return entry.code.equalsIgnoreCase(code);
    }

    private String randomCode(int len) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private BufferedImage render(String code) {
        int w = 150, h = 50;
        BufferedImage image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, w, h);
        g.setColor(Color.LIGHT_GRAY);
        for (int i = 0; i < 20; i++) {
            int x1 = RANDOM.nextInt(w), y1 = RANDOM.nextInt(h);
            int x2 = RANDOM.nextInt(w), y2 = RANDOM.nextInt(h);
            g.drawLine(x1, y1, x2, y2);
        }
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.BOLD, 28));
        FontMetrics fm = g.getFontMetrics();
        int textWidth = fm.stringWidth(code);
        g.drawString(code, (w - textWidth) / 2, 35);
        g.dispose();
        return image;
    }

    private String encode(BufferedImage image) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            return Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to encode captcha image", e);
        }
    }

    private static final class Entry {
        final String code;
        final Instant expireAt;

        Entry(String code, Instant expireAt) {
            this.code = code;
            this.expireAt = expireAt;
        }
    }
}

