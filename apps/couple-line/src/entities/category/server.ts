import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '#/shared/api/supabase/server'

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  spaceId: z.string().uuid(),
  name: z.string().trim().min(1).max(30),
  type: z.enum(['수입', '지출']),
})

export const fetchCategoriesPageDataFn = createServerFn({ method: 'GET' })
  .inputValidator((input) =>
    z.object({ spaceId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('space_id', data.spaceId)
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return { categories }
  })

export const upsertCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((input) => categorySchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const payload = {
      space_id: data.spaceId,
      name: data.name,
      type: data.type,
    }

    const query = data.id
      ? supabase
          .from('categories')
          .update(payload)
          .eq('id', data.id)
          .eq('space_id', data.spaceId)
      : supabase.from('categories').insert(payload)

    const { error } = await query

    if (error) {
      throw error
    }

    return { success: true }
  })

export const deleteCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator((input) =>
    z
      .object({
        spaceId: z.string().uuid(),
        categoryId: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', data.categoryId)
      .eq('space_id', data.spaceId)

    if (error) {
      throw error
    }

    return { success: true }
  })
