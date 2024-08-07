"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { Stack, Typography, Modal, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { firestore } from "../firebase";
import { doc, getDocs, query, collection, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: 3,
};

type PantryItem = {
  name: string;
  count: number;
};

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [pantry, setPantry] = React.useState<PantryItem[]>([]);
  const [itemName, setItemName] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList: PantryItem[] = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() } as PantryItem);
    });
    setPantry(pantryList);
  };

  React.useEffect(() => {
    updatePantry();
  }, []);

  const addItems = async (item: string) => {
    const docRef = doc(firestore, "pantry", item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().count || 0;
      await setDoc(docRef, { count: currentCount + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    updatePantry();
  };

  const removeItems = async (item: string) => {
    const docRef = doc(firestore, "pantry", item);
    await deleteDoc(docRef);
    updatePantry();
  };

  const increaseItemCount = async (item: string) => {
    const docRef = doc(firestore, "pantry", item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().count || 0;
      await setDoc(docRef, { count: currentCount + 1 });
      updatePantry();
    }
  };

  const SearchBar = ({ setSearchQuery }: { setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) => (
    <form>
      <TextField
        id="search-bar"
        onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
        label="Search item"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton type="button" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </form>
  );

  const filterData = (query: string, data: PantryItem[]) => {
    if (!query) {
      return data;
    } else {
      return data.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    }
  };

  const filteredPantry = filterData(searchQuery, pantry);

  return (
    <Box>
      <Box width={"90%"} marginLeft={"20px"} marginTop={"20px"} borderBottom={"2px solid grey"}>
        <Typography color={"yellowgreen"} fontStyle={"italic"} fontFamily={"cursive"} variant="h2">..PT</Typography>
      </Box>
      <Box width={"100vw"} height={"100vh"} display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" height="50px" direction={"row"} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="contained" onClick={() => { addItems(itemName); setItemName(""); handleClose(); }}>
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box width={"700px"} display={"flex"} height="100px" borderBottom={"2px solid black"} borderLeft={"2px solid black"} borderRadius={"20px"} marginBottom={"10px"} padding={"5px"}>
          <Typography variant="h3" padding={"20px"} color={"Crimson"}>Pantry Items</Typography>
          <Stack padding={"30px"}><SearchBar setSearchQuery={setSearchQuery} /></Stack>
        </Box>
        <Button variant="contained" onClick={handleOpen}>ADD ITEMS</Button>
        
        <Stack width="700px" height="400px" spacing={2} overflow={"auto"} margin={"10px"}>
          {filteredPantry.map((item, index) => (
            <Box key={index} width="100%" minHeight="30px" display={"flex"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} bgcolor={"white"} border={"1px solid Crimson"} gap={2}>
              <Typography variant="h5" color={"#333"} textAlign={"left"} margin={"10px"} fontWeight={'bold'}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="h6" color={"Green"} margin={"10px"} padding={"5px"}>
                Quantity: {item.count}
              </Typography>
              <Button variant="contained" onClick={() => increaseItemCount(item.name)}>+</Button>
              <Button variant="contained" onClick={() => removeItems(item.name)}>-</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
