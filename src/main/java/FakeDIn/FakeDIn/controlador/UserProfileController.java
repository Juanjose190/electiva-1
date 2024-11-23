/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package FakeDIn.FakeDIn.controlador;

/**
 *
 * @author JUAN JOSE
 */

import FakeDIn.FakeDIn.modelo.UserProfile;
import FakeDIn.FakeDIn.servicios.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<String> createProfile(@RequestBody UserProfile profile) {
        String response = userProfileService.createProfile(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfileByUserId(@PathVariable String userId) {
        UserProfile profile = userProfileService.getProfileByUserId(userId);
        return profile != null ? ResponseEntity.ok(profile) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllProfiles() {
        List<UserProfile> profiles = userProfileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable String id, @RequestBody UserProfile updatedProfile) {
        UserProfile existingProfile = userProfileService.getProfileByUserId(updatedProfile.getUserId());
        if (existingProfile != null) {
            existingProfile.setFullName(updatedProfile.getFullName());
            existingProfile.setBirthDate(updatedProfile.getBirthDate());
            existingProfile.setEducation(updatedProfile.getEducation());
            userProfileService.createProfile(existingProfile);
            return ResponseEntity.ok("Perfil actualizado exitosamente");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfile(@PathVariable String id) {
        try {
            userProfileService.deleteProfileById(id);
            return ResponseEntity.ok("Perfil eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil no encontrado");
        }
    }
}
