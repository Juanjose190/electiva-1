package FakeDIn.FakeDIn.servicios;

import FakeDIn.FakeDIn.modelo.User;
import FakeDIn.FakeDIn.repository.UserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public String registerUser(User user) {
     
        userRepository.save(user);
        return "Usuario registrado exitosamente";
    }

   public String loginUser(User user) {
 
    Optional<User> existingUserOptional = userRepository.findByUsername(user.getUsername());
    
    if (existingUserOptional.isPresent()) {
        User existingUser = existingUserOptional.get();
        
        
        if (existingUser.getPassword().equals(user.getPassword())) {
            return "Inicio de sesión exitoso";
        } else {
            return "Credenciales incorrectas";
        }
    } else {
        return "Usuario no encontrado";
    }
}


    public String updateUser(String userId, User updatedUser) {
        Optional<User> existingUserOptional = userRepository.findById(userId);
        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setEmail(updatedUser.getEmail());
            userRepository.save(existingUser);
            return "Usuario actualizado exitosamente";
        } else {
            return "Usuario no encontrado";
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
