import { on } from 'chirashi'
import anime from 'animejs'

export default class ItemList{
    constructor(links, goToGenre){
        this.links = links
        this.goToGenre = goToGenre

        this.init()
    }

    init(){
        this.initEventOnLinks()
    }

    initEventOnLinks(){
        let current_nav_genre = document.querySelector('.current_genre')
        let isOnAbout = false
        for(let i = 0; i < this.links.length; i++){
            let link = this.links[i]

            this.createLetters(link)

            on(link, {
                click : (e) => {
                    let link_target_elem = e.srcElement,
                        id_target_elem = link_target_elem.dataset.id,
                        name_target_elem = link_target_elem.children[0],
                        line_target_elem = link_target_elem.children[1]

                    let line_active = document.querySelectorAll('.lineItemActive')

                    anime({
                        targets : line_active,
                        width : 22,
                        duration : 800,
                        ease : 'easeOutExpo',
                    })

                    // reset active links
                    
                    for(let j = 0; j < this.links.length; j++){
                        let other_link = this.links[j],
                            name_other_link = other_link.children[0],
                            line_other_link = other_link.children[1]

                            
                        other_link.className = "nav__about link"

                        if(line_other_link){    
                            this.animateOutLink(name_other_link, line_other_link, () => {
                                line_other_link.className = "lineItem"
                                line_other_link.style.width = "22px"
                                name_other_link.className = "name_genre"
                            })
                        }
                    }
                    
                    if(line_target_elem){
                        // @TODO: CORRIGER BUG ASYNC ANIME, SETTIMEOUT TEMP

                        setTimeout(() => {
                            link_target_elem.className = "nav__about link_active"
                            this.animateInLink(name_target_elem, line_target_elem, () => {
                                line_target_elem.className = "lineItemActive"
                                name_target_elem.className = "name_genre_active"
                                current_nav_genre.textContent = name_target_elem.textContent
                            })
                        }, 200)
                        
                        this.goToGenre(Number(id_target_elem))
                    }
                    else {
                        link_target_elem.className = "nav__about link_active"
                        if(!isOnAbout){
                            isOnAbout = true
                            current_nav_genre.textContent = this.links[this.links.length - 1].textContent
                            this.links[this.links.length - 1].className = "nav__about link_active"
                            
                            this.goToGenre(0)
                            this.show_aboutPage()
                        } else {
                            isOnAbout = false
                            this.links[this.links.length - 1].className = "nav__about link"
                            this.hide_aboutPage()
                        }
                    }
                }
            })
        }
    }

    
    show_aboutPage(){
        let about_el = document.querySelector('.about')
        let footer_middle_el = document.querySelector('.ui__footer__center')
        about_el.style.pointerEvents = 'auto';
        footer_middle_el.pointerEvents = 'none'
        
        anime({
            targets : footer_middle_el,
            opacity : 0,
            duration : 1000,
            ease : 'easeInQuad',
            complete : () => {
                anime({
                    targets : about_el.style,
                    opacity : 1,
                    duration : 3000,
                    delay : 2500,
                    ease : 'easeOutQuad'
                })
            }
        })
    }


    hide_aboutPage(){
        let about_el = document.querySelector('.about')
        let footer_middle_el = document.querySelector('.ui__footer__center')
        about_el.style.pointerEvents = 'auto';
        footer_middle_el.pointerEvents = 'auto'
        
        anime({
            targets : about_el.style,
            opacity : 0,
            duration : 2000,
            ease : 'easeOutQuad',
            complete: () => {
                anime({
                    targets : footer_middle_el,
                    opacity : 1,
                    duration : 1000,
                    ease : 'easeInQuad',
                })
            },
        })
    }

    animateInLink(name, line, callback){
        console.log('name style', name.style)
        console.log('line style', line.style)

        anime({
            targets : line.style,
            width : "44px",
            height : "2px",
            duration : 800,
            ease : 'easeOutExpo',
            complete : () => {
                callback()
            }
        })
    }

    animateOutLink(name, line, callback){
        console.log('animateOut link')

        anime({
            targets : line.style,
            width : "22px",
            height : "1px",
            duration : 800,
            ease : 'easeInExpo',
            complete : () => {
                callback()
            }
        })
    }

    createLetters(linkname) {
        for (let i = 0; i < linkname.length; i += 1) {
            append(this.songInfosArtist, createElement(`a.anim-letter{${linkname[i]}}`))
        }
    }
}