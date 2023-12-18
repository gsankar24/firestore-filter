// pages/edit/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../config/firebase';
import { ref, query, set, onValue } from 'firebase/database';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Card, CardContent, Typography } from '@mui/material';

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState({ id: '', title: '' });

  useEffect(() => {
    if (id) {
      const userRef = ref(db, `workitems/${id}`);
      onValue(userRef, (snapshot) => {
        const user = snapshot.val();
        console.log("EDIT DATA", user);
        setUserData(user || { id: '', title: '' });
      });
    }
  }, [id]);
  const handleSave = () => {
    // Save updated data to Firebase
    const userRef = ref(db, `workitems/${id}`);
    set(userRef, userData);
    // Redirect back to home page after save
    router.push('/');
  };
  const handleCancel = () => {
    router.push('/');
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Edit User
          </Typography>
          <form>
            <TextField
              label="Name"
              value={userData.id}
              onChange={(e) => setUserData({ ...userData, id: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={userData.title}
              onChange={(e) => setUserData({ ...userData, title: e.target.value })}
              multiline
              fullWidth
              margin="normal"
            />
            <div style={{textAlign: 'right'}}>
              <Button variant="contained" color="primary" onClick={handleCancel} style={{ marginTop: '20px' }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px', marginLeft: '8px' }}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUser;
