import React, {ChangeEvent, FormEvent, useCallback, useState} from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import { useHistory } from "react-router-dom";
import mapIcon from "../../utils/mapIcon";

import './styles.css';
import api from "../../services/api";

const CreateOrphanage: React.FC = () => {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const history = useHistory();

  const handleMapClick = useCallback(({latlng}: LeafletMouseEvent) => {
    setPosition({
      latitude: latlng.lat,
      longitude: latlng.lng
    });
  }, []);

  const handleSelectImages = useCallback(({target}: ChangeEvent<HTMLInputElement>) => {
    if (!target.files) return;
    
    const seletedImages = Array.from(target.files);

    const seletedImagesPreview = seletedImages.map(image => URL.createObjectURL(image));

    setImages(seletedImages);
    setPreviewImages(seletedImagesPreview);

  }, []);

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));

    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('/orphanages', data);

    alert('Cadastro realizado com sucesso');

    history.push('/app');

  }, [
    position,
    name,
    about,
    instructions,
    opening_hours,
    open_on_weekends,
    images,
    history
  ]);

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-23.6104103,-47.0096692]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[position.latitude, position.longitude]} 
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" 
                value={name} 
                onChange={({target}) => setName(target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about" 
                maxLength={300} 
                value={about} 
                onChange={({target}) => setAbout(target.value)}   
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => (
                  <img key={image} src={image} alt={name} />
                ))}

                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input type="file" onChange={handleSelectImages} multiple id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={instructions} 
                onChange={({target}) => setInstructions(target.value)}
              ></textarea>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de atendimento</label>
              <input 
                id="opening_hours" 
                value={opening_hours} 
                onChange={({target}) => setOpeningHours(target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  onClick={() => setOpenOnWeekends(true)}
                  className={open_on_weekends ? 'active' : ''}
                >
                  Sim
                </button>
                <button 
                  type="button"
                  onClick={() => setOpenOnWeekends(false)}
                  className={!open_on_weekends ? 'active' : ''}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateOrphanage;

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
