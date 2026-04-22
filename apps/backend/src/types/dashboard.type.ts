export interface BestSellerItem {
    product_id: string
    product_name: string
    total_quantity: number
}

export interface DashboardSummary {
    revenue: number
    total_vat: number
    best_sellers: BestSellerItem[]
}