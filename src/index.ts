
// import several dependencies which our smart contract will make use of.
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, float32 } from 'azle';
import { v4 as uuidv4 } from 'uuid';


// define the structure of the data we'll be working with. In our case, this is the 'Blog Post' that will be posted on the board
/**
 * This type represents a blog post that can be listed on a board.
 */
type BlogPost = Record<{
    id: string;
    name: string;
    title: string;
    body: string;
    attachmentURL: string;
    comments: Vec<Comment>;
    likes: float32;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>


// specify a blog post payload. This specifies the type of data to send to our smart contract
type BlogPostPayload = Record<{
    name: string;
    title: string;
    body: string;
    attachmentURL: string;
}>

// Specify comments that can be listed in our blog post.
type Comment = Record<{
    id: string;
    body: string;
    name: string;
    createdAt: nat64;
}>

// specific a comment payload. This specifies the type of data to send to our smart contract
type CommentPayload = Record<{
    body: string;
    name: string;
}>

// stores our blog posts for easy retrieval 
const blogPostStorage = new StableBTreeMap<string, BlogPost>(0, 44, 1024);

// gets all blog posts from storage
$query;
export function getBlogPosts(): Result<Vec<BlogPost>, string> {
    return Result.Ok(blogPostStorage.values());
}

// gets a specific blog post from storage
$query;
export function getBlogPost(id: string): Result<BlogPost, string> {
    return match(blogPostStorage.get(id), {
        Some: (blogPost) => Result.Ok<BlogPost, string>(blogPost),
        None: () => Result.Err<BlogPost, string>(`a blog post with id=${id} not found`)
    });
}


// creates a new blog post
$update;
export function addBlogPost(payload: BlogPostPayload): Result<BlogPost, string> {
    const blogPost: BlogPost = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, likes: 0, comments: [], ...payload };
    blogPostStorage.insert(blogPost.id, blogPost);
    return Result.Ok(blogPost);
}


//Edit and updates previous blog post
$update;
export function updateBlogPost(id: string, payload: BlogPostPayload): Result<BlogPost, string> {
    return match(blogPostStorage.get(id), {
        Some: (blogPost) => {
            const updatedBlogPost: BlogPost = {...blogPost, ...payload, updatedAt: Opt.Some(ic.time())};
            blogPostStorage.insert(blogPost.id, updatedBlogPost);
            return Result.Ok<BlogPost, string>(updatedBlogPost);
        },
        None: () => Result.Err<BlogPost, string>(`couldn't update a blog post with id=${id}. blogPost not found`)
    });
}


// delete a specific blog post
$update;
export function deleteBlogPost(id: string): Result<BlogPost, string> {
    return match(blogPostStorage.remove(id), {
        Some: (deletedBlogPost) => Result.Ok<BlogPost, string>(deletedBlogPost),
        None: () => Result.Err<BlogPost, string>(`couldn't delete a blog post with id=${id}. blogPost not found.`)
    });
}


// like a specific blog post
$update;
export function likeBlogPost(id: string): Result<BlogPost, string> {
    return match(blogPostStorage.get(id), {
        Some: (blogPost) => {
            const likedBlogPost: BlogPost = { ...blogPost, likes: blogPost.likes + 1 };
            blogPostStorage.insert(blogPost.id, likedBlogPost);
            return Result.Ok<BlogPost, string>(likedBlogPost);
        },
        None: () => Result.Err<BlogPost, string>(`Blog post with id=${id} not found`)
    });
}


// give a comment on a blog post
$update;
export function giveComment(id: string, payload: CommentPayload): Result<BlogPost, string> {
    return match(blogPostStorage.get(id), {
        Some: (blogPost) => {
            const comment: Comment = {
                id: uuidv4(),
                body: payload.body,
                name: payload.name,
                createdAt: ic.time()
            };
            const updatedBlogPost: BlogPost = { ...blogPost, comments: [...blogPost.comments, comment] };
            blogPostStorage.insert(id, updatedBlogPost);
            return Result.Ok<BlogPost, string>(updatedBlogPost);
        },
        None: () => Result.Err<BlogPost, string>(`Blog post with id=${id} not found`)
    });
}


// update comment
$update;
export function updateComment(id: string, payload: CommentPayload): Result<BlogPost, string> {
    return match(blogPostStorage.get(id), {
        Some: (blogPost) => {
            const updatedBlogPost: BlogPost = { ...blogPost, ...payload };
            blogPostStorage.insert(id, updatedBlogPost);
            return Result.Ok<BlogPost, string>(updatedBlogPost);
        },
        None: () => Result.Err<BlogPost, string>(`Blog post with id=${id} not found`)
    });
}


// a workaround to make uuid package work with Azle
globalThis.crypto = {
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};
