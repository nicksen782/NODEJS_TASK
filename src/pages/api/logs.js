import axios from 'axios';

export default async function handler(req, res) {
    // Only allow GET.
    if (req.method === 'GET') {
        try {
            const { data } = await axios.get('http://localhost:3001/logs');
            return res.status(200).json(data);
        } 
        catch (error) {
            return res.status(500).json({ message: 'Error fetching logs' });
        }
    } 
    else {
        res.setHeader('Allow', 'GET');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
