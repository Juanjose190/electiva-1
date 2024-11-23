package FakeDIn.FakeDIn.servicios;

import FakeDIn.FakeDIn.modelo.Post;
import FakeDIn.FakeDIn.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public String createPost(String text, MultipartFile file, String userId) {
        try {
            String imageUrl = saveFile(file);
            Post post = new Post(userId, text, imageUrl);
            postRepository.save(post);
            return "Post created successfully!";
        } catch (IOException e) {
            return "Error saving file: " + e.getMessage();
        }
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public String updatePost(String postId, String text, MultipartFile file) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            if (text != null && !text.isEmpty()) {
                post.setText(text);
            }
            if (file != null && !file.isEmpty()) {
                try {
                    String imageUrl = saveFile(file);
                    post.setImageUrl(imageUrl);
                } catch (IOException e) {
                    return "Error updating file: " + e.getMessage();
                }
            }
            postRepository.save(post);
            return "Post updated successfully!";
        } else {
            return "Post not found!";
        }
    }

    public String deletePost(String postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            postRepository.deleteById(postId);
            return "Post deleted successfully!";
        } else {
            return "Post not found!";
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + fileName);
        java.nio.file.Files.write(path, file.getBytes());
        return fileName;
    }
}
