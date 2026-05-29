import { startups } from "../data/startups"

export function calculateTotalInvested(
  investments: any[]
) {
  return investments.reduce(
    (sum, investment) =>
      sum + investment.amount,
    0
  )
}

export function calculatePortfolioValue(
  investments: any[]
) {
  return investments.reduce(
    (sum, investment) => {
      const startup =
        startups.find(
          (s) =>
            s.slug ===
            investment.startup_slug
        )

      const multiplier =
        startup?.growthMultiplier ||
        1

      return (
        sum +
        investment.amount *
          multiplier
      )
    },
    0
  )
}

export function calculateReturns(
  investments: any[]
) {
  return (
    calculatePortfolioValue(
      investments
    ) -
    calculateTotalInvested(
      investments
    )
  )
}