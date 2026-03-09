import React, {useState} from 'react';
import { validateContact } from '../../lib/validation/contact';
import { apiPost } from '../../lib/api';

export default function ContactForm(){
  const [form, setForm] = useState({name:'',email:'',message:''});
  const [status, setStatus] = useState<{ok:boolean,msg:string}|null>(null);
  const [busy, setBusy] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    const { valid, errors } = validateContact(form);
    if(!valid){
      setStatus({ok:false,msg: Object.values(errors).join(' / ')});
      return;
    }
    setBusy(true);
    try{
      await apiPost('/api/contact', form);
      setStatus({ok:true,msg:'Message envoyé — merci !'});
      setForm({name:'',email:'',message:''});
    }catch(err:any){
      console.error(err);
      setStatus({ok:false,msg: err?.message || 'Erreur serveur'});
    }finally{setBusy(false)}
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      <div>
        <label>Nom</label>
        <input name="name" value={form.name} onChange={onChange} className="input-text" required />
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} className="input-text" required />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={onChange} className="input-textarea" rows={6} />
      </div>
      <div style={{marginTop:8}}>
        <button type="submit" className="btn primary" disabled={busy}>{busy? 'Envoi...' : 'Envoyer'}</button>
      </div>
      {status && (
        <p style={{marginTop:8,color: status.ok ? 'green' : 'crimson'}}>{status.msg}</p>
      )}
    </form>
  );
}
