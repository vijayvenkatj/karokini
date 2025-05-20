"use server"

import { createClient } from "@/utils/supabase/server"

export const SignIn = async (formData: FormData) => {

    const email = formData.get('email')
    const password = formData.get('password')
  
    const supabase = await createClient()
    const {data,error} = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    })
    if (error) {
      return { error , success:false }
    }
    return { data, success:true }
}

