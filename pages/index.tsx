// pages/index.tsx
import React, { useEffect, useState } from 'react';
import { firestore } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
  TableContainer,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Link from 'next/link';

const Home = () => {
  const [data, setData] = useState<
    Array<{
      id: string;
      title: string;
      priority: string;
      owner: { emailId: string };
      createdBy: { emailId: string };
      divisionId: { name: string };
      categoriesId: { name: { name: string } };
      startDate: string;
      endDate: string;
      updatedAt: string;
      isArchived: boolean;
    }>
  >([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<string>('All');

  const fetchData = () => {
    const workitemsCollection = collection(firestore, 'workitems');
    let queryRef = query(workitemsCollection); // Default query without filtering
    // console.log("Fetch Data", queryRef);
    if (startDate && endDate) {
      // Apply date range filter if start and end dates are provided
      queryRef = query(
        workitemsCollection,
        where('startDate', '>=', startDate),
        where('startDate', '<=', endDate),
        orderBy('updatedAt')
      );
    }

    if (filterOption === 'Active') {
      queryRef = query(
        queryRef,
        where('isArchived', '==', false),
        orderBy('updatedAt', 'desc')
      );
    } else if (filterOption === 'Archived') {
      queryRef = query(
        queryRef,
        where('isArchived', '==', true),
        orderBy('updatedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const fetchedData: Array<{
        id: string;
        title: string;
        priority: string;
        owner: { emailId: string };
        createdBy: { emailId: string };
        divisionId: { name: string };
        categoriesId: { name: { name: string } };
        startDate: string;
        endDate: string;
        updatedAt: string;
        isArchived: boolean;
      }> = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '', // Ensure to handle cases where fields might be missing
          priority: data.priority || '',
          owner: data.owner || { emailId: '' },
          createdBy: data.createdBy || { emailId: '' },
          divisionId: data.divisionId || { name: '' },
          categoriesId: data.categoriesId || { name: { name: '' } },
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          updatedAt: data.updatedAt || '',
          isArchived: data.isArchived || false,
        };
      });
      // fetchedData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      console.log("Fetch Data", fetchedData);

      setData(fetchedData);
    });

    // Return the unsubscribe function directly
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchData();
    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, [filterOption]);


  const handleDateFilterButtonClick = () => {
    fetchData();
  };

  // Fetch data initially when the component mounts
  useEffect(() => {
    const unsubscribe = fetchData();
    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, [filterOption]); // Fetch data when filterOption changes

  return (
    <div style={{ marginTop: '150px' }}>
      <Grid xl={8} style={{ textAlign: 'center' }}>
        <div>
          <h1>Workitems</h1>
        </div>
      </Grid>
      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <FormControl style={{ width: '12%' }}>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value as string)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate || ''}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '12%' }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate || ''}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '12%', marginLeft: '18px' }}
        />
        <Button
          variant="contained"
          onClick={handleDateFilterButtonClick}
          style={{ width: '100px', height: '55px', marginLeft: '18px' }}
        >
          Filter
        </Button>
      </Grid>

      <Grid style={{ display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <TableContainer component={Paper} style={{ width: '90%', height: '500px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Projects</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Modified</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{`${item.owner.emailId.split('@')[0]}@`}</TableCell>
                  <TableCell>{`${item.createdBy.emailId.split('@')[0]}@`}</TableCell>
                  <TableCell>{item.divisionId.name}</TableCell>
                  <TableCell>{item.categoriesId.name.name}</TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>{item.updatedAt}</TableCell>
                  <TableCell>
                    <Link href={`/edit/${index}`}>
                      <Button variant="contained">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default Home;
