import { useEffect, useState } from 'react';
import { Grid, Stack, TextField, Button, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import axios from 'utils/axios';


interface BankingInfo {
  id?: number;
  branch: string;
  branchCode: string;
  accountNo: string;
}

const BankingInformation = () => {
  const [bankingInfo, setBankingInfo] = useState<BankingInfo>({
    branch: '',
    branchCode: '',
    accountNo: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 Component mounted - Starting to fetch banking info...');
    fetchBankingInfo();
  }, []);

  const fetchBankingInfo = async () => {
    try {
      console.log('📡 Making API call to /api/BankAccountInfo...');
      setLoading(true);
      
      const response = await axios.get('/api/BankAccountInfo');
      console.log('📥 Raw API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log('📋 API returned an array of length:', response.data.length);
        if (response.data.length > 0) {
          console.log('💳 Using first banking record:', response.data[0]);
          setBankingInfo(response.data[0]);
        } else {
          console.log('❌ No banking records found in array');
        }
      } else if (response.data) {
        console.log('💳 Using single banking record:', response.data);
        setBankingInfo(response.data);
      }
    } catch (error) {
      console.error('🔴 Error fetching banking information:', error);
    } finally {
      setLoading(false);
      console.log('✅ Final banking info state:', bankingInfo);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        branch: bankingInfo.branch,
        branchCode: bankingInfo.branchCode,
        accountNo: bankingInfo.accountNo
      };

      if (bankingInfo.id) {
        await axios.put(`/api/BankAccountInfo/${bankingInfo.id}`, payload);
      } else {
        await axios.post('/api/BankAccountInfo', payload);
      }

      setIsEditing(false);
      fetchBankingInfo();
    } catch (error) {
      console.error('Error saving banking information:', error);
    }
  };

  const handleChange = (field: keyof BankingInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankingInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="Banking Information">
          {!loading && !bankingInfo.id && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No banking details found. Please add your banking information.
            </Alert>
          )}
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Branch"
              value={bankingInfo.branch}
              onChange={handleChange('branch')}
              disabled={!isEditing}
              required
            />
            <TextField
              fullWidth
              label="Branch Code"
              value={bankingInfo.branchCode}
              onChange={handleChange('branchCode')}
              disabled={!isEditing}
              required
            />
            <TextField
              fullWidth
              label="Account Number"
              value={bankingInfo.accountNo}
              onChange={handleChange('accountNo')}
              disabled={!isEditing}
              required
            />
            {isEditing ? (
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit}
                  disabled={!bankingInfo.branch || !bankingInfo.branchCode || !bankingInfo.accountNo}
                >
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                {bankingInfo.id ? 'Edit' : 'Add'} Banking Details
              </Button>
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default BankingInformation; 