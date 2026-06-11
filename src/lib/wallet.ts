import { supabase } from "./supabase"

type WalletInsert = {
  user_id: string
  available_balance: number
  locked_balance: number
  total_deposited: number
  total_invested: number
  total_returns: number
  total_withdrawn: number
  currency: "INR"
  status: "active"
}

const DUPLICATE_KEY_ERROR = "23505"

export async function createInvestorWallet(
  userId: string
) {
  const initialWallet: WalletInsert =
    {
      user_id: userId,
      available_balance: 0,
      locked_balance: 0,
      total_deposited: 0,
      total_invested: 0,
      total_returns: 0,
      total_withdrawn: 0,
      currency: "INR",
      status: "active",
    }

  const { error } = await supabase
    .from("wallets")
    .insert(initialWallet)

  if (
    error &&
    error.code !== DUPLICATE_KEY_ERROR
  ) {
    throw error
  }
}
