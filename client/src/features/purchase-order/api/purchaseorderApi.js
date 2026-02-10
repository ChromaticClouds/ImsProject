export const fetchPurchaseOrders = async () => {
  const res = await fetch('/api/purchaseorder');
  
  if(!res.ok){
    throw new Error('NO NO');
  }

  return res.json();
};