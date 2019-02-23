import { router } from '@vue-storefront/core/app'
import rootStore from '@vue-storefront/core/store'
import { localizedDispatcherRoute, localizedRoute, currentStoreView, removeStoreCodeFromRoute, LocalizedRoute } from '@vue-storefront/core/lib/multistore'
import { Route, Dictionary } from 'vue-router/types/router';
import { RouterManager } from '@vue-storefront/core/lib/router-manager'

export function processDynamicRoute(routeData, fullPath, addToRoutes = true) {
  const userRoute = RouterManager.findByName(routeData.name)
  if (userRoute) {
    const config = rootStore.state.config
    if (addToRoutes) {
      const routes = []
      const rootDynamicRoute = Object.assign({}, userRoute, routeData, { path: '/' + fullPath, name: `urldispatcher-${fullPath}` })
      routes.push(rootDynamicRoute)
      if (config.storeViews.mapStoreUrlsFor.length > 0 && config.storeViews.multistore === true) {
        for (let storeCode of config.storeViews.mapStoreUrlsFor) {
          if (storeCode) {
            const dynamicRoute = Object.assign({}, userRoute, routeData, { path: '/' + ((rootStore.state.config.defaultStoreCode !== storeCode) ? (storeCode + '/') : '') + fullPath, name: `urldispatcher-${fullPath}-${storeCode}` })
            routes.push(dynamicRoute)
          }
        }
      }
      RouterManager.addRoutes(routes, router)
      return routes
    } else {
      const storeView = currentStoreView()
      const dynamicRoute = Object.assign({}, userRoute, routeData, { path: '/' + fullPath, name: `urldispatcher-${fullPath}` })
      return dynamicRoute
    }
  } else {
    return null
  }
}

export function findRouteByPath(fullPath) {
  return RouterManager.findByPath(fullPath)
}

export function normalizeUrlPath(url, removeStoreCode = true) {
  if (url && url.length > 0) {
    if (url[0] === '/') url = url.slice(1)
    const queryPos = url.indexOf('?')
    if (queryPos > 0) url = url.slice(0, queryPos)
  }
  return url  
}

export function formatCategoryLink(category) {
  return rootStore.state.config.seo.useUrlDispatcher ? ('/' + category.url_path) : ((rootStore.state.config.products.useShortCatalogUrls ? '/' : '/c/') + category.slug)  
}

export function formatProductLink(product, storeCode) {
  if(rootStore.state.config.seo.useUrlDispatcher) {
    const routeData: LocalizedRoute = {
      fullPath: product.url_path,
      params: {
        childSku: product.sku === product.parentSku ? null : product.sku
      }
    }
    return localizedDispatcherRoute(routeData, storeCode)
  } else {
    const routeData: LocalizedRoute = {
      name: product.type_id + '-product',
      params: {
        parentSku: product.parentSku ? product.parentSku : product.sku,
        slug: product.slug,
        childSku: product.sku
      }
    }
    return localizedRoute(routeData, storeCode)
  }
}