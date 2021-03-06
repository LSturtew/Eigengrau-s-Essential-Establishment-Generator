setup.createDebt = function (town, npc) {
  console.groupCollapsed(`${npc.name} is in debt!`)
  const profit = npc.finances.profit(town, npc) // expressed in copper! Assumed to be negative (often is not, though!)
  const grossIncome = npc.finances.grossIncome(town, npc) // expressed in copper!
  const debtRate = Math.abs(profit / grossIncome) // typically a floating point, ~0.2
  const cashLiquidity = Math.abs(grossIncome / profit) // usually 3-10
  console.log({
    profit,
    grossIncome,
    debtRate,
    cashLiquidity
  })
  // TODO a lot of the maths in here is really fucky. Someone with an economics degree please save me.
  if (npc.wealth > (cashLiquidity * grossIncome)) {
    console.log(`${npc.name} has too much cash (${npc.wealth}), and is losing some of that to pay debts.`)
    npc.wealth *= 1 - debtRate
  }

  const debtorParameters = function (town, npc, obj) {
    if (obj.profession === 'moneylender' && obj.key !== npc.key) return true
  }

  const sharkParameters = function (town, npc, obj) {
    if (obj.profession === 'loan shark' && obj.key !== npc.key) return true
  }

  if (profit < -40) {
    const debtor = setup.findExistingNpc(town, State.variables.npcs, npc, debtorParameters, { profession: 'moneylender', isShallow: true })
    setup.createRelationship(town, npc, debtor, 'debtor', 'creditor')
    npc.finances.creditors[debtor.key] = Math.round(cashLiquidity * grossIncome)
    debtor.finances.debtors[npc.key] = npc.finances.creditors[debtor.key]
  }

  if (profit < -300 || setup.socialClass[npc.socialClass].key <= 3) {
    const predatoryDebtor = setup.findExistingNpc(town, State.variables.npcs, npc, sharkParameters, { profession: 'loan shark', isShallow: true })
    setup.createRelationship(town, npc, predatoryDebtor, 'predatory debtor', 'creditor')
    npc.finances.creditors[predatoryDebtor.key] = Math.round(cashLiquidity * grossIncome * (random(1) + random(2, 4)))
    predatoryDebtor.finances.debtors[npc.key] = npc.finances.creditors[predatoryDebtor.key]
  }
  console.groupEnd()
  return npc
}
