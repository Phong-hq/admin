import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

import type { BRAND_RESPONSE } from '@/types/product/brand'
import type { CATEGORY_RESPONSE } from '@/types/product/category'
import type { SelectConfigItem } from '@/types'
import type { SUPPLIER_RESPONSE } from '@/types/setting/supplier'
import type { PRODUCT_VARIANTS_RESPONSE } from '@/types/product/product'
import type { INVENTORY_RESPONSE } from '@/types/inventory/inventory'
import type { CLIENT_RESPONSE } from '@/types/person/client'
import { isJsonString } from '@/utils/json'
import type { OFFICE_RESPONSE } from '@/types/setting/office'
import type { PROMOTION_RESPONSE } from '@/types/promotion'
import type { CONTACT_RESPONSE } from '@/types/customer/contact'
import type { USER_RESPONSE } from '@/types/setting/user'
import type { GROUP_RESPONSE } from '@/types/setting/group'
import { useGroupStore } from '@/stores/setting/group'

const getImage = (value: string) => {
  if (isJsonString(value)) {
    return JSON.parse(value)[0]
  } else {
    return value || ''
  }
}

export const useSelectDataStore = defineStore('selectDataStore', {
  state: () => ({
    selectList: {
      brand: [] as SelectConfigItem[],
      supplier: [] as SelectConfigItem[],
      category: [] as SelectConfigItem[],
      office: [] as SelectConfigItem[],
      inventory: [] as SelectConfigItem[],
      variant: [] as SelectConfigItem[],
      client: [] as SelectConfigItem[],
      promotion: [] as SelectConfigItem[],
      province: [] as SelectConfigItem[],
      contact: [] as SelectConfigItem[],
      user: [] as SelectConfigItem[],
      group: [] as SelectConfigItem[]
    },
    hasChange: {
      brand: false,
      supplier: false,
      category: false,
      office: false,
      inventory: false,
      variant: false,
      client: false,
      promotion: false,
      contact: false,
      user: false,
      group: false
    }
  }),
  getters: {},
  actions: {
    async getSelectList() {
      // return Promise.allSettled([
      //   this.getBrandList(),
      //   this.getSupplierList(),
      //   this.getCategoryList(),
      //   this.getOfficeList()
      // ])
      try {
        await this.getBrandList()
        await this.getSupplierList()
        await this.getCategoryList()
        await this.getOfficeList()
        await this.getInventoryList()
      } catch (error) {
        console.log(error)
      }
    },
    async getBrandList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.brand.length > 0 && !reload && !this.hasChange.brand) {
            this.hasChange.brand = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<BRAND_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/brand?status=1'
          )
          this.selectList.brand = res.items.map((e) => {
            return { value: e.id, label: e.name, image: e.icon } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async searchBrandList(key: string): Promise<SelectConfigItem[]> {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<BRAND_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/brand?status=1&name=' + key
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.name, image: e.icon } as SelectConfigItem
          })
          if (!key) this.selectList.brand = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getSupplierList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        this.hasChange.supplier = false
        try {
          if (this.selectList.supplier.length > 0 && !reload && !this.hasChange.supplier) {
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<SUPPLIER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/general/supplier'
          )
          this.selectList.supplier = res.items.map((e: any) => {
            return { value: e.id, label: e.name } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async searchSupplierList(key: string) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<SUPPLIER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/general/supplier?name=' + key
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.name } as SelectConfigItem
          })
          if (!key) this.selectList.supplier = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getCategoryList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.category.length > 0 && !reload && !this.hasChange.category) {
            this.hasChange.category = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<CATEGORY_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/category?status=1'
          )
          this.selectList.category = res.items.map((e) => {
            return { value: e.id, label: e.name } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async searchCategoryList(key: string) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CATEGORY_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/category?status=1&name=' + key
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.name } as SelectConfigItem
          })
          if (!key) this.selectList.category = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getOfficeList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.office.length > 0 && !reload && !this.hasChange.office) {
            this.hasChange.office = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<any> = await axios.get(
            '/api/v1/admin/setting/office?status=1'
          )
          this.selectList.office = res.items.map((e: any) => {
            return { value: e.id, label: e.address1 || e.address2 || '' } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async searchOfficeList(key: string) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<OFFICE_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/office?status=1&address1=' + key
          )
          const selectResponse = res.items.map((e: any) => {
            return {
              value: e.id,
              label: e.address1 || e.address2 || '',
              image: e.image
            } as SelectConfigItem
          })
          if (!key) this.selectList.office = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getInventoryList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.inventory.length > 0 && !reload && !this.hasChange.inventory) {
            this.hasChange.inventory = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<any> = await axios.get('/api/v1/admin/setting/inventory')
          this.selectList.inventory = res.items.map((e: any) => {
            return { value: e.id, label: e.name || '', image: e.image } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async searchInventoryList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<any> = await axios.get(
            '/api/v1/admin/setting/office?name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e: any) => {
            return {
              value: e.id,
              label: e.address1 || e.address2 || '',
              image: e.image
            } as SelectConfigItem
          })
          if (!key) this.selectList.inventory = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async getVariantList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.variant.length > 0 && !reload && !this.hasChange.variant) {
            this.hasChange.variant = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<PRODUCT_VARIANTS_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/variant?name'
          )
          this.selectList.variant = res.items.map((e) => {
            return {
              value: e.id,
              label: e.name || '',
              image: (e.images ?? [''])[0]
            } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchVariantList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<PRODUCT_VARIANTS_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/variant?name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return {
              value: e.id,
              label: e.name || '',
              image: (e.images ?? [''])[0]
            } as SelectConfigItem
          })
          if (!key) this.selectList.variant = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchVariantInventoryList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<INVENTORY_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/inventory?product_variant_name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return {
              value: e.id,
              label: e.product_variant?.name || '',
              image: e.product_variant?.images,
              description: 'SL: ' + (e.available ?? 0)
            } as SelectConfigItem
          })
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async getClientList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.variant.length > 0 && !reload && !this.hasChange.variant) {
            this.hasChange.variant = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<CLIENT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/client?name'
          )
          this.selectList.client = res.items.map((e) => {
            return { value: e.id, label: e.name || '' } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchClientList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CLIENT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/client?name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.name || '' } as SelectConfigItem
          })
          if (!key) this.selectList.client = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getPromotionList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.promotion.length > 0 && !reload && !this.hasChange.promotion) {
            this.hasChange.promotion = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<PROMOTION_RESPONSE[]> = await axios.get(
            '/api/v1/admin/order/promotion?title'
          )
          this.selectList.promotion = res.items.map((e) => {
            return { value: e.id, label: e.title || '' } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchPromotionList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<PROMOTION_RESPONSE[]> = await axios.get(
            '/api/v1/admin/order/promotion?title=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.title || '' } as SelectConfigItem
          })
          if (!key) this.selectList.promotion = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async getProvinceList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.province.length > 0 && !reload) {
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<{ code: string; full_name: string }[]> = await axios.get(
            '/api/v1/frontend/location/province'
          )
          this.selectList.province = res.items.map((e) => {
            return { value: e.code, label: e.full_name || '' } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchProvinceList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<{ code: string; full_name: string }[]> = await axios.get(
            '/api/v1/frontend/location/province?full_name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.code, label: e.full_name || '' } as SelectConfigItem
          })
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchDistrictList(key: string, params?: { province_code: any }) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<{ code: string; full_name: string }[]> = await axios.get(
            '/api/v1/frontend/location/province/district?full_name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.code, label: e.full_name || '' } as SelectConfigItem
          })
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchWardList(key: string, params?: { province_code: any }) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<{ code: string; full_name: string }[]> = await axios.get(
            '/api/v1/frontend/location/province/ward?full_name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.code, label: e.full_name || '' } as SelectConfigItem
          })
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async getContactList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.contact.length > 0 && !reload && !this.hasChange.contact) {
            this.hasChange.contact = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<CONTACT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/contact'
          )
          this.selectList.contact = res.items.map((e) => {
            return { value: e.id, label: e.name || '' } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchContactList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CONTACT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/contact?name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.name || '' } as SelectConfigItem
          })
          if (!key) this.selectList.contact = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    async getUserList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.user.length > 0 && !reload && !this.hasChange.contact) {
            this.hasChange.user = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<USER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/user?status=1'
          )
          this.selectList.user = res.items.map((e) => {
            return { value: e.id, label: e.username || '' } as SelectConfigItem
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    async searchUserList(key: string, params?: any) {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<USER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/contact?name=' + key,
            { params }
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.username || '' } as SelectConfigItem
          })
          if (!key) this.selectList.user = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },

    // Setting - Group select data
    async getGroupList(reload?: boolean) {
      return new Promise<any>(async (resolve, reject) => {
        try {
          if (this.selectList.group.length > 0 && !reload && !this.hasChange.group) {
            this.hasChange.group = false
            resolve(true)
            return
          }

          const res: DataWithMetaResponse<GROUP_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/room/index-group'
          )
          this.getGroupListState(res.items)
          this.selectList.group = res.items.map((e) => {
            return { value: e.id, label: e.name } as SelectConfigItem
          })
          
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async searchGroupList(key: string): Promise<SelectConfigItem[]> {
      return new Promise<SelectConfigItem[]>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<GROUP_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/room/index-group?&name=' + key
          )
          const selectResponse = res.items.map((e) => {
            return { value: e.id, label: e.name } as SelectConfigItem
          })
          if (!key) this.selectList.group = selectResponse
          resolve(selectResponse)
        } catch (error) {
          reject(error)
        }
      })
    },
    getGroupListState(item: GROUP_RESPONSE[]) {
      const groupStore = useGroupStore()
      groupStore.groupList = item
    }
  }
})
