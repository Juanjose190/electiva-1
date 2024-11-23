package FakeDIn.FakeDIn.repository;

import FakeDIn.FakeDIn.modelo.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
}
