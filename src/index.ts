import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, float32 } from 'azle';
import { v4 as uuidv4 } from 'uuid';

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

type BlogPostPayload = Record<{
    name: string;
    title: string;
    body: string;
    attachmentURL: string;
}>

type Comment = Record<{
    id: string;
    body: string;
    name: string;
    createdAt: nat64;
}>

type CommentPayload = Record<{
    body: string;
    name: string;
}>




const blogPostStorage = new StableBTreeMap<string, BlogPost>(0, 44, 1024);

$query;
export function getBlogPosts(): Result<Vec<BlogPost>, string> {
    return Result.Ok(blogPostStorage.values());
}

$query;
export function getBlogPost(id: string): Result<BlogPost, string> {
    return match(blogPostStorage.get(id), {
        Some: (blogPost) => Result.Ok<BlogPost, string>(blogPost),
        None: () => Result.Err<BlogPost, string>(`a blog post with id=${id} not found`)
    });
}

$update;
export function addBlogPost(payload: BlogPostPayload): Result<BlogPost, string> {
    const blogPost: BlogPost = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, likes: 0, comments: [], ...payload };
    blogPostStorage.insert(blogPost.id, blogPost);
    return Result.Ok(blogPost);
}

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

$update;
export function deleteBlogPost(id: string): Result<BlogPost, string> {
    return match(blogPostStorage.remove(id), {
        Some: (deletedBlogPost) => Result.Ok<BlogPost, string>(deletedBlogPost),
        None: () => Result.Err<BlogPost, string>(`couldn't delete a blog post with id=${id}. blogPost not found.`)
    });
}

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
