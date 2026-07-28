# Shotkut QA Bug Report

**Website:** https://www.shotkut.com\

## Summary

As part of the technical assessment, I performed a manual QA audit of
the Shotkut website using Chrome DevTools, Network inspection, and
normal user interaction.

------------------------------------------------------------------------

# Bug 1 --- Direct Preview Media URLs Are Publicly Accessible (High Severity)

**Category:** Security / Content Protection

### Description

During testing, the Network tab exposed direct preview media URLs hosted
on Amazon S3. The API response also returns a publicly accessible
`previewURL` field. Anyone with this URL can open the preview asset
directly in the browser and access it outside the application.

If these preview assets are intended to be protected or restricted to
authenticated users, exposing direct media URLs may weaken content
protection.

### Steps to Reproduce

1.  Open any stock video.
2.  Open Chrome DevTools → Network.
3.  Filter by **Media** or inspect the video API request.
4.  Copy the `previewURL` returned in the API response or open the
    `preview.mp4` request.
5.  Paste the URL into a new browser tab.

### Expected Result

Preview media should be served using signed URLs or authenticated
requests if access control is intended.

### Actual Result

The preview asset is directly accessible through a public URL.

### Evidence

**Network request exposing preview asset**

![](screenshots/Screenshot%202026-07-28%20161121.png)

**Direct preview URL opened in browser**

![](screenshots/Screenshot%202026-07-28%20161141.png)

**API response exposing `previewURL`**

![](screenshots/Screenshot%202026-07-28%20161819.png)

------------------------------------------------------------------------

# Bug 2 --- User Session Is Not Persisted (Medium Severity)

**Category:** Authentication / UX

### Description

Refreshing the page logs the user out, and no authentication/session
cookie was observed during testing.

### Steps to Reproduce

1.  Login.
2.  Refresh the page.
3.  Observe that the user is logged out.

### Evidence

![](screenshots/Screenshot%202026-07-28%20161525.png)

------------------------------------------------------------------------

# Bug 3 --- "Start Free Now" Button Is Non-functional (Medium Severity)

**Category:** Functional

### Description

The **Start free now** button on the search/filter page does not perform
any action.

### Steps to Reproduce

1.  Open the search page.
2.  Click **Start free now**.

### Expected Result

Navigate to signup or free plan onboarding.

### Actual Result

No action occurs.

### Evidence

![](screenshots/Screenshot%202026-07-28%20162339.png)

------------------------------------------------------------------------

# Bug 4 --- Slow Search Experience (Low--Medium Severity)

**Category:** Performance

### Description

Search results take noticeable time to load and display skeleton
placeholders for an extended period before rendering content.

### Evidence

![](screenshots/Screenshot%202026-07-28%20162044.png)

------------------------------------------------------------------------

# Recommendations

-   Protect preview media using signed URLs or authenticated streaming.
-   Persist user sessions using secure HttpOnly refresh-token cookies or
    server-side sessions.
-   Fix the "Start free now" CTA.
-   Optimize search using indexing, caching, pagination, and request
    debouncing.

------------------------------------------------------------------------

**Note:** Findings are based on manual testing using browser developer
tools.
