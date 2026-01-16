import axios from 'axios';

export class LinkedinService {
    private baseURL;
    constructor() {
        this.baseURL = 'https://api.linkedin.com/v2';
    }

    /**
     * Get the user's URN (Unique Resource Name)
     * Required before posting.
     */
    async getMemberUrn(accessToken: any) {
        const response = await axios.get(`${this.baseURL}/userinfo`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        // The sub field contains the person URN identifier
        return `urn:li:person:${response.data.sub}`;
    }

    /**
     * Post a share to LinkedIn
     * @param {string} accessToken - User's Bearer token
     * @param {string} text - The post content
     */
    async postToProfile(accessToken: any, text: string) {
        try {
            const personUrn = await this.getMemberUrn(accessToken);

            const postData = {
                author: personUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: { text: text },
                        shareMediaCategory: 'NONE',
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                },
            };

            const response = await axios.post(
                'https://api.linkedin.com/v2/ugcPosts',
                postData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Restli-Protocol-Version': '2.0.0',
                    },
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('LinkedIn API Error:', error.response?.data || error.message);
                throw new Error(`LinkedIn Error: ${error.message}`);
            } else {
                console.error('LinkedIn API Error:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`LinkedIn Error: ${errorMessage}`);
            }
        }
    }
}

export const linkedinService = new LinkedinService();