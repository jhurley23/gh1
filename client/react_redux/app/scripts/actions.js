import * as types from './types';
import { SiteApi, UserApi } from './api';

const siteApi = new SiteApi();
const userApi = new UserApi();
const LOADING = {
    type: types.LOADING,
    meta: {
        remote: true
    }
};

export function addSite (site) {
    return (dispatch) => {
        dispatch(LOADING);
        
        siteApi.create(site).then((response) => {
            dispatch({
                type: types.ADD_SITE_SUCCESS,
                site: response.data.site
            });
        })
        .catch (() => {
            dispatch({
                type: types.ADD_SITE_FAIL
            });
        });
    };
}

export function getSites (params) {
    return (dispatch, getState) => {
        dispatch(LOADING);

        params = params || {};
        const pagination = params.pagination || getState().get('pagination').toJS();
        const tag = params.tag || getState().get('searchTag');
        siteApi.find({
            pagination: pagination,
            tag: tag
        })
        .then((response) => {
            dispatch({
                type: types.SITE_LIST_SUCCESS,
                sites: response.data.sites,
                pagination: {
                    current: response.data.current,
                    next: response.data.next,
                    previous: response.data.previous,
                    page: pagination.page,
                    perPage: pagination.perPage
                }
            });
        })
        .catch(() => {
            dispatch({
                type: types.SITE_LIST_FAIL
            });
        });
    };
}

export function updateSite (params) {
    return (dispatch, getState) => {
        dispatch(LOADING);
        siteApi.updateSite(params).then((response) => {
            dispatch({
                type: types.SITE_UPDATE_SUCCESS,
                site: response.data.site,
                siteIndex: params.siteIndex,
                user: getState().get('user').toJS()
            });
        })
        .catch(() => {
            dispatch({
                type: types.SITE_UPDATE_FAIL
            });
        });
    };
}

export function addTag (tag) {
    return (dispatch, getState) => {
        dispatch(LOADING);
        const state = getState().toJS();

        siteApi.addTag({
            tag: tag,
            site: state.siteEdit,
            siteIndex: state.siteIndex,
            user: state.user
        })
        .then((response) => {
            dispatch({
                type: types.ADD_TAG_SUCCESS,
                site: response.data.site,
                siteIndex: state.siteIndex
            });
        })
        .catch(() => {
            dispatch({
                type: types.ADD_TAG_FAIL
            });
        });
    };
}

export function removeTag (params) {
    return (dispatch, getState) => {
        dispatch(LOADING);

        const state = getState();

        siteApi.removeTag(params).then((response) => {
            dispatch({
                type: types.REMOVE_TAG_SUCCESS,
                site: response.data.site,
                siteIndex: params.siteIndex,
                user: state.get('user').toJS()
            });
        })
        .catch(() => {
            dispatch({
                type: types.REMOVE_TAG_FAIL
            });
        });
    };
}

export function getTags (params) {
    return (dispatch) => {
        siteApi.getTags(params).then((response) => {
            let tags = [];
            const result = response.data.tags;
            result.forEach((item) => {
                tags.push({ title: item });
            });
            dispatch({
                type: types.GET_TAGS_SUCCESS,
                tags: tags
            });
        })
        .catch(() => {
            dispatch({
                type: types.GET_TAGS_FAIL
            });
        });
    };
}

export function setSearchTag (tag) {
    return {
        type: types.SET_SEARCH_TAG,
        searchTag: tag
    };
}

export function setSiteEdit (site, siteIndex) {
    return {
        type: types.SET_SITE,
        siteEdit: site,
        siteIndex: siteIndex
    };
}

export function resetError (key) {
    return {
        type: types.RESET_ERROR,
        error: key
    };
}

export function nextPage () {
    return {
        type: types.SET_NEXT_PAGE
    };
}

export function previousPage () {
    return {
        type: types.SET_PREVIOUS_PAGE
    };
}

export function refreshList () {
    return {
        type: types.SET_REFRESH_LIST
    };
}

export function authenticate (email, password) {
    return (dispatch) => {
        dispatch(LOADING);

        userApi.authenticate(email, password)
        .then((response) => {
            dispatch({
                type: types.AUTHENTICATE_SUCCESS,
                user: response.data.user
            });
        })
        .catch(() => {
            dispatch({
                type: types.AUTHENTICATE_FAIL
            });
        });
    };
}

export function dontRedirectAgainWhileIsAutenticated () {
    return {
        type: types.SET_REDIRECT_OFF
    };
}