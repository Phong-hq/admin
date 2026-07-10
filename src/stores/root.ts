import { defineStore } from 'pinia'
import type { ConfirmPayload } from '@/types'

export const useRootStore = defineStore('rootStore', {
  state: () => ({
    confirmPayload: null as
      | null
      | (ConfirmPayload & {
          resolve: Resolve
          reject: Reject
        }),
    confirmTimeoutPayload: null as
      | null
      | (ConfirmPayload & {
          resolve: Resolve
          reject: Reject
        }),
    isNetworkError: false,
    loadingPage: false,
    menuCollapsed: false,
    isFullScreen: false,
    isMobile: false as boolean,
  }),
  actions: {
    confirm(payload: ConfirmPayload) {
      return new Promise((resolve, reject) => {
        this.confirmPayload = {
          ...payload,
          resolve,
          reject
        }
      })
    },
    // confirmTimeout(payload: ConfirmPayload) {
    //   return new Promise((resolve, reject) => {
    //     this.confirmTimeoutPayload = {
    //       ...payload,
    //       resolve,
    //       reject,
    //     }
    //   })
    // },
    resetConfirm() {
      this.confirmPayload = null
    },
    showLoading() {
      this.loadingPage = true
    },
    hideLoading() {
      this.loadingPage = false
    },
    // Check device type and set isMobile state
    checkIsMobile() {
      this.isMobile = window.innerWidth < 640
    },
    startTracking() {
      this.checkIsMobile()
      window.addEventListener('resize', this.checkIsMobile)
    },
    stopTracking() {
      window.removeEventListener('resize', this.checkIsMobile)
    }
    // resetConfirmTimeout() {
    //   this.confirmTimeoutPayload = null;
    // },
  }
})
