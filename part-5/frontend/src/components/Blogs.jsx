import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Blogs({ blogs }) {
    return (
        <>
            <h2>Blogs</h2>
            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Blog Title</TableCell>
                            <TableCell>Author</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.map((b) => (
                            <TableRow key={b.id} hover>
                                <TableCell>
                                    <Link to={`/blogs/${b.id}`}>{b.title}</Link>
                                </TableCell>
                                <TableCell>{b.author}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
