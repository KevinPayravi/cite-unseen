let currentDialogApp = null;
let currentMountPoint = null;

/**
 * Unmount the currently active Vue dialog and remove its mount point.
 */
export function closeCurrentDialog() {
    if (currentDialogApp) {
        currentDialogApp.unmount();
        currentDialogApp = null;
    }

    const mountPoint = currentMountPoint || document.getElementById('cite-unseen-dialog-mount');
    if (mountPoint) {
        mountPoint.remove();
    }

    currentMountPoint = null;
}

/**
 * Ensure the shared dialog mount point exists in the document.
 * @returns {HTMLElement} The dialog mount point
 */
export function ensureDialogMount() {
    let mountPoint = document.getElementById('cite-unseen-dialog-mount');
    if (!mountPoint) {
        mountPoint = document.createElement('div');
        mountPoint.id = 'cite-unseen-dialog-mount';
        document.body.appendChild(mountPoint);
    }

    return mountPoint;
}

/**
 * Track the currently active dialog app and mount point.
 * @param {Object} app - Mounted Vue application
 * @param {HTMLElement} mountPoint - DOM node used as the Vue mount point
 */
export function setCurrentDialog(app, mountPoint) {
    currentDialogApp = app;
    currentMountPoint = mountPoint;
}

/**
 * Close a dialog after Codex has time to play its close animation.
 * @param {Object} app - Vue application requesting the close
 * @param {HTMLElement} mountPoint - Mount point associated with the closing dialog
 */
export function closeDialogAfterAnimation(app, mountPoint) {
    setTimeout(() => {
        if (app === currentDialogApp && mountPoint === currentMountPoint) {
            closeCurrentDialog();
        }
    }, 300);
}
