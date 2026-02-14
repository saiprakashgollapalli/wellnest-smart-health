package com.wellnest.service;

import com.wellnest.dto.WorkoutDto;
import com.wellnest.entity.User;
import com.wellnest.entity.Workout;
import com.wellnest.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for workout log management.
 */
@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    /* ================= CREATE ================= */

    @Transactional
    public WorkoutDto createWorkout(Long userId, WorkoutDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + userId));

        LocalDate date = dto.getDate() != null
                ? dto.getDate()
                : LocalDate.now();

        // Prevent duplicate workout for same day
        if (workoutRepository.existsByUserIdAndDate(userId, date)) {
            throw new IllegalArgumentException(
                    "Workout already exists for this date");
        }

        Workout workout = modelMapper.map(dto, Workout.class);
        workout.setId(null);
        workout.setUser(user);
        workout.setDate(date);

        return toDto(workoutRepository.save(workout));
    }

    /* ================= READ ================= */

    @Transactional(readOnly = true)
    public List<WorkoutDto> getWorkoutsByUser(Long userId) {
        return workoutRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkoutDto getWorkoutById(Long id, Long userId) {
        Workout workout = getOwnedWorkout(id, userId);
        return toDto(workout);
    }

    /** Today's workout (dashboard support) */
    @Transactional(readOnly = true)
    public WorkoutDto getTodayWorkout(Long userId) {
        return workoutRepository.findByUserIdAndDate(userId, LocalDate.now())
                .map(this::toDto)
                .orElse(null);
    }

    /* ================= UPDATE ================= */

    @Transactional
    public WorkoutDto updateWorkout(Long id, Long userId, WorkoutDto dto) {

        Workout workout = getOwnedWorkout(id, userId);

        workout.setWorkoutType(dto.getWorkoutType());
        workout.setDate(dto.getDate());
        workout.setDuration(dto.getDuration());
        workout.setCaloriesBurned(dto.getCaloriesBurned());
        workout.setNotes(dto.getNotes());

        return toDto(workoutRepository.save(workout));
    }

    /* ================= DELETE ================= */

    @Transactional
    public void deleteWorkout(Long id, Long userId) {
        Workout workout = getOwnedWorkout(id, userId);
        workoutRepository.delete(workout);
    }

    /* ================= HELPERS ================= */

    /** Ensures user can only access their own workout */
    private Workout getOwnedWorkout(Long workoutId, Long userId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Workout not found: " + workoutId));

        if (!workout.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Workout not found: " + workoutId);
        }

        return workout;
    }

    private WorkoutDto toDto(Workout workout) {
        WorkoutDto dto = modelMapper.map(workout, WorkoutDto.class);
        dto.setUserId(workout.getUser().getId());
        return dto;
    }
    @Transactional(readOnly = true)
public List<WorkoutDto> getWorkoutsByDateRange(
        Long userId,
        LocalDate start,
        LocalDate end) {

    return workoutRepository
            .findByUserIdAndDateBetween(userId, start, end)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
}

}
