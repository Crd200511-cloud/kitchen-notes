export async function getAiUsageSummary() {
  return {
    todayUsed: 0,
    todayLimit: 20,
    remaining: 20
  };
}
