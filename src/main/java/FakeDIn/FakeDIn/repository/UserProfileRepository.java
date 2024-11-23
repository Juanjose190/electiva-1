/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package FakeDIn.FakeDIn.repository;

/**
 *
 * @author JUAN JOSE
 */



import FakeDIn.FakeDIn.modelo.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    UserProfile findByUserId(String userId);
}
