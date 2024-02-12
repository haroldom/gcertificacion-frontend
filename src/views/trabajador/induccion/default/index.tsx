import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";
import { Clase, TIPO_CLASE, Trabajador } from "../../../../interfaces/entities";
import { RootState, getClasesByTrabajador, useAppDispatch, useAppSelector } from "../../../../store";
import { useAPIData } from "../../../../api/useAPIData";
import { useAuthUser } from 'react-auth-kit'
import HeaderTrabajadorView from "../../../header/header";
import moment from "moment";

export default function ViewInduccionDefault () {
    const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    //const [trabajador, setTrabajador] = React.useState<Trabajador>(initialStateTrabajador);
    const [inducciones, setInducciones] = React.useState<Clase[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAuthUser();

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || '0'));
    }, []);

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setInducciones(data.filter(clase => clase.tipo === TIPO_CLASE.INDUCCION));
        },
        onRejected: error => {
            console.log(error);
        },
        onPending: () => {
        }
    }), [clasesReducer]));
  return (
    <Box component="main" sx={{width: '100%', }}>
            <HeaderTrabajadorView />

            <Paper sx={{width: '100%', p:2}}>
                <Grid container spacing={4} justifyContent={'center'}>
                {inducciones.map(induccion => {
                    let fecha_inicio = moment(induccion.fecha_inicio);
                    let fecha_fin = moment(induccion.fecha_fin);
                    let fecha_actual = moment();

                    let disponible = fecha_actual.isAfter(fecha_inicio, 'minutes') && fecha_actual.isBefore(fecha_fin, 'minutes');

                    return (
                        <Grid item key={induccion.id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                            <CardActionArea onClick={() => navigate(`/trabajador/induccion/${induccion.id}`, {replace: false}) } disabled={!disponible} >
                                <CardMedia
                                    component="img"
                                    height="280"
                                    sx={{width: 'fit-content'}}
                                    image={induccion.imagen}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {induccion.titulo}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {induccion.descripcion}
                                    </Typography>
                                    {!disponible &&
                                    <Typography variant="body2" color="text.secondary">
                                        Disponible desde: {fecha_inicio.format('DD/MM/YYYY')}
                                    </Typography>}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    )
                })}
                </Grid>
            </Paper>
        </Box>
  )
}