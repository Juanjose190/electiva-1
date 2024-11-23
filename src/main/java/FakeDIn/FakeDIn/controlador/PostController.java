package FakeDIn.FakeDIn.controlador;

import FakeDIn.FakeDIn.modelo.Post;
import FakeDIn.FakeDIn.servicios.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createPost(
            @RequestParam("text") String text,
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId) {
        String response = postService.createPost(text, file, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(
            @PathVariable("id") String postId,
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        String response = postService.updatePost(postId, text, file);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable("id") String postId) {
        String response = postService.deletePost(postId);
        return ResponseEntity.ok(response);
    }
}
