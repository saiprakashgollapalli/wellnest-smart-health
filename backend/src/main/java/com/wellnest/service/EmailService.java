package com.wellnest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // ===============================
    // OTP MAIL
    // ===============================
    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("WellNest - OTP Verification");
        message.setText(
                "Your WellNest OTP is: " + otp +
                "\n\nThis OTP is valid for 5 minutes."
        );

        mailSender.send(message);
    }

    // ===============================
    // WELCOME MAIL ⭐ NEW
    // ===============================
    public void sendWelcomeMail(String toEmail, String name) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to WellNest 🎉");

        message.setText(
                "Hi " + name + ",\n\n" +
                "Welcome to WellNest! 🎉\n\n" +
                "Your account has been successfully verified.\n" +
                "You can now login and start tracking your fitness, workouts, and health journey.\n\n" +
                "We're excited to have you with us!\n\n" +
                "— Team WellNest"
        );

        mailSender.send(message);
    }
}
