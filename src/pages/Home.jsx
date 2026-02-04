import '../style.css'
import { Imagesearch } from '../components/Imagesearch'
import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'
import logo from "../assets/logo.png"


export function Home() {

    const { language, setLanguage, text } = useContext(LanguageContext);


    return (
        <main className='justify-center'>
            <header >
                <div className='grid max-1600 center'>


                    <div className="fit">
                        <img className='grid-image' src={logo}/>
                    </div>    
                                    
                    <h1 className='grid-title'>Simpsons image search</h1>
                    <select className='language-selector grid-language' value={language} onChange={(e) => setLanguage(e.target.value)} >
                        <option value="en" onClick={() => setLanguage("en")} >🇬🇧 English</option>
                        <option value="es" onClick={() => setLanguage("es")} >🇪🇸 Español</option>
                        <option value="it" onClick={() => setLanguage("it")} >🇮🇹 Italiano</option>
                        <option value="pt" onClick={() => setLanguage("pt")} >🇧🇷 Português</option>
                        <option value="fr" onClick={() => setLanguage("fr")} >🇫🇷 Français</option>
                        <option value="de" onClick={() => setLanguage("de")} >🇩🇪 Deutsch</option>
                        <option value="ru" onClick={() => setLanguage("ru")} >🇷🇺 Русский</option>
                        <option value="no" onClick={() => setLanguage("no")} >🇳🇴 Norsk</option>
                        <option value="tr" onClick={() => setLanguage("tr")} >🇹🇷 Türkçe</option>

                    </select>
                </div>

            </header>

            <section className="flexmain" >
                    <Imagesearch></Imagesearch>
            </section>

        </main>
    )
}