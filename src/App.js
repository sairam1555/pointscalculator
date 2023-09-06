import './App.css';
import * as React from 'react'

function App() {
  var month = React.useMemo(() => (["January","February","March","April","May","June","July",
  "August","September","October","November","December"]),[]);

  const getData = () => {
    fetch('./ordersdata.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(data) {
        if(data && data.length)
        {
          const orderHistory = data;
          orderHistory?.map((item) => {        
            const orderAmount = Number(item?.orderAmount);
            item.formatedOrderDate = new Date(item.orderDate);
            if(item?.orderAmount > 100)
            {
              const execss100 = orderAmount - 100;
              //calculating for more than 100
              let rewardPoints = 2 * execss100;
              
              //calculating between 50 - 100
              rewardPoints += 1 * 50;
              item.rewardEarned = rewardPoints;
            }
            else if(item?.orderAmount >= 50 && item?.orderAmount <= 100)
            {
              const execss50 = orderAmount - 50;
              //calculating between 50 - 100
              let rewardPoints = 1 * execss50;
              item.rewardEarned = rewardPoints;
            }
            else{
              item.rewardEarned = 0;
            }
            return item
          })
          setCustomerName(Array.from(new Set(orderHistory.map((item) => item.customerName))))
          const uniqueMonths = Array.from(new Set(orderHistory.map((item) => new Date(item.formatedOrderDate).getMonth())))
          setUniqueMonths([...uniqueMonths?.sort()?.map((item) => month[item]), 'Total'])
          setCustomerData(orderHistory);
        }
      });
  }

  const [customerData, setCustomerData] = React.useState([]);
  const [customerName, setCustomerName] = React.useState([]);
  const [uniqueMonths, setUniqueMonths] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
  const [selectedTimeFrame, setSelectedTimeFrame] = React.useState("");
  const [earnedRewards, setEarnedRewards] = React.useState(0);
  const [validationMsg, setValidationMsg] = React.useState("");

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  }

  const handleTimeFrameChange = (e) => {
    setSelectedTimeFrame(e.target.value);
  }

  const calculatePoints = () => {
    if(selectedTimeFrame === "" || selectedCustomer === ""){
      setValidationMsg("Please Select Fields")
      return
    }
    setValidationMsg("")
    const timeFrame = selectedTimeFrame;
    const customer = selectedCustomer;
    let sum = 0;
    const monthNumber = month.indexOf(selectedTimeFrame);
    
    if(timeFrame === 'Total')
    {
      customerData?.filter((a) => a.customerName === customer)?.forEach(num => {
        sum += num.rewardEarned;
      })
      setEarnedRewards(sum);
      // setCustomerData(customerData.filter(a=>a.customerName === selectedCustomer));
    }
    else{
      
      customerData?.filter((a) => a.customerName === customer && a.formatedOrderDate.getMonth() === monthNumber)?.forEach(num => {
        sum += num.rewardEarned;
      })
      setEarnedRewards(sum);
      // setCustomerData(customerData.filter(a=>a.customerName === selectedCustomer && a.formatedOrderDate.getMonth() === monthNumber));
    }
  }
  
  React.useEffect(()=>{
    getData();
  },[])

  return (
    <div className="App">
      <h2 style={{backgroundColor: '#dfd5d5', marginBottom: 50}}>Reward Points Calculator</h2>
      <div style={{
        width: '40%',
        height: '500px',
        overflowY: 'scroll',
        float:'left'
      }}>
        <table class="table stripped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Order Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Reward Earned</th>
            </tr>
          </thead>
          <tbody>
          {customerData && customerData.length > 0 && customerData.map((item)=>
            <>
              <tr>
                <th scope="row">{item?._id}</th>
                <td>{item?.customerName}</td>
                <td>{item?.orderDate}</td>
                <td>{`$ ${item?.orderAmount}`}</td>
                <td>{`${item?.rewardEarned}`}</td>
              </tr>
            </>
            )
          }
          </tbody>
        </table>
      </div>

      <div style={{
        width: '50%',
        height: '400px',
        display: 'inline',
        textAlign: 'left',
        padding: '0 40px 40px',
        float: 'left'
      }}>
        <select class="custom-select mr-3 mb-3" 
          value={selectedCustomer} 
          onChange={handleCustomerChange}
          >
          <option selected value="">Select Customer</option>
          {customerName && customerName.length && customerName.map((item) => <option value={item}>{item}</option>)}
        </select>
        
        <select class="custom-select mb-3"
          value={selectedTimeFrame}
          onChange={handleTimeFrameChange}
        >
          <option selected value="">Select Time Frame</option>
          {uniqueMonths && uniqueMonths.length && uniqueMonths.map((item) => <option value={item}>{item}</option>)}
        </select>

        <span style={{color:'red', fontSize: '12px', fontWeight: 'bold'}}>{validationMsg}</span>

        <br/>
        <br/>

        <button type="button" class="btn btn-primary" onClick={() => calculatePoints()}>Calculate</button>

        <br/>
        <br/>
        <br/>

        <span style={{ fontWeight: 'bold'}}>Reward Earned : {earnedRewards}</span>
      </div>
    </div>
  );
}

export default App;
