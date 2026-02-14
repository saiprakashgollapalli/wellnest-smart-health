package com.wellnest.service;

import com.wellnest.dto.TrackingDto.NutritionLogDto;
import com.wellnest.dto.TrackingDto.SleepLogDto;
import com.wellnest.entity.*;
import com.wellnest.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.wellnest.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Services for Nutrition and Sleep tracking.
 */
@Service
@RequiredArgsConstructor
public class TrackingService {

    private final NutritionLogRepository nutritionRepo;
    private final SleepLogRepository sleepRepo;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // ─────────────────── NUTRITION ────────────────────────────────────────────

    @Transactional
    public NutritionLogDto createNutritionLog(Long userId, NutritionLogDto dto) {
        User user = getUser(userId);
        NutritionLog log = modelMapper.map(dto, NutritionLog.class);
        log.setId(null);
        log.setUser(user);
        return toNutritionDto(nutritionRepo.save(log));
    }

    @Transactional(readOnly = true)
    public List<NutritionLogDto> getNutritionLogsByUser(Long userId) {
        return nutritionRepo.findByUserIdOrderByDateDesc(userId)
                .stream().map(this::toNutritionDto).collect(Collectors.toList());
    }

    @Transactional
    public NutritionLogDto updateNutritionLog(Long id, Long userId, NutritionLogDto dto) {
        NutritionLog log = nutritionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition log not found: " + id));
        ensureOwnership(log.getUser().getId(), userId, "Nutrition log");

        log.setMealType(dto.getMealType());
        log.setFoodItems(dto.getFoodItems());
        log.setCaloriesConsumed(dto.getCaloriesConsumed());
        log.setProteinGrams(dto.getProteinGrams());
        log.setCarbsGrams(dto.getCarbsGrams());
        log.setFatGrams(dto.getFatGrams());
        log.setDate(dto.getDate());

        return toNutritionDto(nutritionRepo.save(log));
    }

    @Transactional
    public void deleteNutritionLog(Long id, Long userId) {
        NutritionLog log = nutritionRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nutrition log not found: " + id));
        ensureOwnership(log.getUser().getId(), userId, "Nutrition log");
        nutritionRepo.delete(log);
    }

    // ─────────────────── SLEEP ────────────────────────────────────────────────

    @Transactional
    public SleepLogDto createSleepLog(Long userId, SleepLogDto dto) {
        User user = getUser(userId);
        SleepLog log = modelMapper.map(dto, SleepLog.class);
        log.setId(null);
        log.setUser(user);
        return toSleepDto(sleepRepo.save(log));
    }

    @Transactional(readOnly = true)
    public List<SleepLogDto> getSleepLogsByUser(Long userId) {
        return sleepRepo.findByUserIdOrderByDateDesc(userId)
                .stream().map(this::toSleepDto).collect(Collectors.toList());
    }

    @Transactional
    public SleepLogDto updateSleepLog(Long id, Long userId, SleepLogDto dto) {
        SleepLog log = sleepRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sleep log not found: " + id));
        ensureOwnership(log.getUser().getId(), userId, "Sleep log");

        log.setDate(dto.getDate());
        log.setBedTime(dto.getBedTime());
        log.setWakeTime(dto.getWakeTime());
        log.setSleepHours(dto.getSleepHours());
        log.setSleepQuality(dto.getSleepQuality());
        log.setNotes(dto.getNotes());

        return toSleepDto(sleepRepo.save(log));
    }

    @Transactional
    public void deleteSleepLog(Long id, Long userId) {
        SleepLog log = sleepRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sleep log not found: " + id));
        ensureOwnership(log.getUser().getId(), userId, "Sleep log");
        sleepRepo.delete(log);
    }

    // ─────────────────── Helpers ──────────────────────────────────────────────

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private void ensureOwnership(Long ownerId, Long requesterId, String resource) {
        if (!ownerId.equals(requesterId)) {
            throw new ResourceNotFoundException(resource + " not found");
        }
    }

    private NutritionLogDto toNutritionDto(NutritionLog log) {
        NutritionLogDto dto = modelMapper.map(log, NutritionLogDto.class);
        dto.setUserId(log.getUser().getId());
        return dto;
    }

    private SleepLogDto toSleepDto(SleepLog log) {
        SleepLogDto dto = modelMapper.map(log, SleepLogDto.class);
        dto.setUserId(log.getUser().getId());
        return dto;
    }
}