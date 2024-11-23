package FakeDIn.FakeDIn.servicios;

import FakeDIn.FakeDIn.modelo.UserProfile;
import FakeDIn.FakeDIn.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public String createProfile(UserProfile profile) {
        userProfileRepository.save(profile);
        return "Perfil creado exitosamente";
    }

    public UserProfile getProfileByUserId(String userId) {
        return userProfileRepository.findByUserId(userId);
    }

    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }
    
    public void deleteProfileById(String id) {
    userProfileRepository.deleteById(id);
}

}
