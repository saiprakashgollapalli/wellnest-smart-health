package com.wellnest.service;

import org.springframework.security.core.Authentication;
import com.wellnest.dto.AuthDto;
import com.wellnest.entity.User;
import com.wellnest.exception.ResourceAlreadyExistsException;
import com.wellnest.repository.UserRepository;
import com.wellnest.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    // ================= REGISTER =================
    public String register(AuthDto.RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("User already exists with this email");
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() == null ? User.Role.USER : request.getRole())
                .gender(request.getGender())
                .otp(otp)
                .otpExpiry(LocalDateTime.now().plusMinutes(5))
                .isVerified(false)
                .build();

        userRepository.save(user);
        emailService.sendOtp(user.getEmail(), otp);

        return "OTP sent to your email. Please verify.";
    }

    // ================= VERIFY OTP =================
    public String verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp))
            throw new RuntimeException("Invalid OTP");

        if (user.getOtpExpiry().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP expired");

        // ⚠️ IMPORTANT:
        // DO NOT clear OTP here (needed for reset flow)
        user.setIsVerified(true);

        userRepository.save(user);
        System.out.println("VERIFY OTP SUCCESS");
        System.out.println("SENDING WELCOME MAIL...");

        // ⭐ SEND WELCOME MAIL
        emailService.sendWelcomeMail(user.getEmail(), user.getName());


        return "Email verified successfully";
    }

    // ================= LOGIN =================
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsVerified())
            throw new RuntimeException("Please verify your email first");

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        ));

        String token = jwtUtils.generateJwtToken(authentication);

        return AuthDto.AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .hasProfile(user.getProfile() != null)
                .build();
    }

    // ================= FORGOT PASSWORD =================
    public String sendResetOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtp(user.getEmail(), otp);

        return "Reset OTP sent";
    }
    // ===============================
// 🔵 VERIFY RESET OTP
// ===============================
public String verifyResetOtp(String email, String otp) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (user.getOtp() == null || !user.getOtp().equals(otp)) {
        throw new RuntimeException("Invalid OTP");
    }

    if (user.getOtpExpiry() == null ||
            user.getOtpExpiry().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("OTP expired");
    }

    // IMPORTANT:
    // do NOT clear otp here — resetPassword needs it
    return "OTP verified";
}


    // ================= RESET PASSWORD =================
    public String resetPassword(String email, String otp, String newPassword) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) return "User not found";

        if (user.getOtp() == null || !user.getOtp().equals(otp))
            return "Invalid OTP";

        if (user.getOtpExpiry() == null ||
                user.getOtpExpiry().isBefore(LocalDateTime.now()))
            return "OTP expired";

        user.setPassword(passwordEncoder.encode(newPassword));

        // ✅ clear OTP ONLY after reset
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return "SUCCESS";
    }
}
