import { callModule, connectModule } from "libkmodule"

const MODULE_SKYLINK_FeedDAC = 'AQCSRGL0vey8Nccy_Pqk3fYTMm0y2nE_dK0I8ro8bZyZ3Q';
/// loadPost
export const loadPost = async (ref) => {
    let [data, err] = await callModule(MODULE_SKYLINK_FeedDAC, 'loadPost', {
        'ref': ref,
    });
    if (err !== null)
        throw err;
    return data;
}
/// loadPostsForUser
export const loadPostsForUser = async (userId, feedId, beforeTimestamp) => {
    let [data, err] = await callModule(MODULE_SKYLINK_FeedDAC, 'loadPostsForUser', {
        'userId': userId,
        'feedId': feedId,
        'beforeTimestamp': beforeTimestamp,
    });
    if (err !== null)
        throw err;
    return data;
}
/// loadCommentsForPost
export const loadCommentsForPost = async (ref, onData) => {
    let [sendUpdate, query] = connectModule(MODULE_SKYLINK_FeedDAC, 'loadCommentsForPost', {
        'ref': ref,
    }, onData);
    let [data, err] = await query;
    if (err !== null)
        throw err;
    return data;
}
/// getCommentsCount
export const getCommentsCount = async (ref, onData) => {
    let [sendUpdate, query] = connectModule(MODULE_SKYLINK_FeedDAC, 'getCommentsCount', {
        'ref': ref,
    }, onData);
    let [data, err] = await query;
    if (err !== null)
        throw err;
    return data;
}
/// listenForPosts
export const listenForPosts = async (userId, feedId, onData) => {
    let [sendUpdate, query] = connectModule(MODULE_SKYLINK_FeedDAC, 'listenForPosts', {
        'userId': userId,
        'feedId': feedId,
    }, onData);
    let [data, err] = await query;
    if (err !== null)
        throw err;
    return data;
}
/// createPost
export const createPost = async (content, feedId) => {
    let [data, err] = await callModule(MODULE_SKYLINK_FeedDAC, 'createPost', {
        'content': content,
        'feedId': feedId,
    });
    if (err !== null)
        throw err;
    return data;
}
/// createComment
export const createComment = async (content, commentTo, parent) => {
    let [data, err] = await callModule(MODULE_SKYLINK_FeedDAC, 'createComment', {
        'content': content,
        'commentTo': commentTo,
        'parent': parent,
    });
    if (err !== null)
        throw err;
    return data;
}
/// createRepost
export const createRepost = async (repostOf, parent) => {
    let [data, err] = await callModule(MODULE_SKYLINK_FeedDAC, 'createRepost', {
        'repostOf': repostOf,
        'parent': parent,
    });
    if (err !== null)
        throw err;
    return data;
}
/// deletePost
export const deletePost = async (ref) => {
    let [data, err] = await callModule(MODULE_SKYLINK_FeedDAC, 'deletePost', {
        'ref': ref,
    });
    if (err !== null)
        throw err;
    return data;
}