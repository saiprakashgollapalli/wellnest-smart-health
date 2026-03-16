package com.wellnest.service;

import com.wellnest.dto.WaterIntakeDto;
import com.wellnest.entity.User;
import com.wellnest.entity.WaterIntake;
import com.wellnest.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.WaterIntakeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WaterIntakeService {

    private final WaterIntakeRepository waterRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    /* ================= CREATE ================= */

    @Transactional
    public WaterIntakeDto createWaterEntry(Long userId, WaterIntakeDto dto) {

        User user = getUser(userId);

        WaterIntake entry = modelMapper.map(dto, WaterIntake.class);
        entry.setId(null);
        entry.setUser(user);

        return toDto(waterRepository.save(entry));
    }

    /* ================= READ ================= */

    @Transactional(readOnly = true)
    public List<WaterIntakeDto> getAllByUser(Long userId) {
        return waterRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getTodayTotal(Long userId) {
        LocalDate today = LocalDate.now();

        return waterRepository.findByUserIdAndDate(userId, today)
                .stream()
                .mapToDouble(w -> w.getLiters() != null ? w.getLiters() : 0.0)
                .sum();
    }

    /* ================= UPDATE ================= */

    @Transactional
    public WaterIntakeDto updateEntry(Long id, Long userId, WaterIntakeDto dto) {

        WaterIntake entry = getOwnedEntry(id, userId);

        entry.setDate(dto.getDate());
        entry.setLiters(dto.getLiters());

        return toDto(waterRepository.save(entry));
    }

    /* ================= DELETE ================= */

    @Transactional
    public void deleteEntry(Long id, Long userId) {
        WaterIntake entry = getOwnedEntry(id, userId);
        waterRepository.delete(entry);
    }

    /* ================= HELPERS ================= */

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + userId));
    }

    private WaterIntake getOwnedEntry(Long id, Long userId) {

        WaterIntake entry = waterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Water entry not found: " + id));

        if (!entry.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Water entry not found: " + id);
        }

        return entry;
    }

    private WaterIntakeDto toDto(WaterIntake entry) {
        WaterIntakeDto dto = modelMapper.map(entry, WaterIntakeDto.class);
        dto.setUserId(entry.getUser().getId());
        return dto;
    }
}