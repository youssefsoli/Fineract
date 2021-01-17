import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
    FloatingMenu,
    MainButton,
    ChildButton,
} from 'react-floating-button-menu';
import MdAdd from '@material-ui/icons/Add';
import MdClose from '@material-ui/icons/Clear';
import MdFavorite from '@material-ui/icons/Favorite';
import { mdiBird } from '@mdi/js';
import Icon from '@mdi/react'

const NavBar = () => {
    const [isOpen, setOpen] = useState(false);
    const history = useHistory();

    return (
        <div>
            <FloatingMenu
                slideSpeed={500}
                direction="down"
                spacing={8}
                isOpen={isOpen}
                className="menu"
            >
                <MainButton
                    iconResting={
                        <MdAdd style={{ fontSize: 20 }} nativeColor="white" />
                    }
                    iconActive={
                        <MdClose style={{ fontSize: 20 }} nativeColor="white" />
                    }
                    backgroundColor="black"
                    onClick={() =>
                        setOpen(!isOpen)
                    }
                    size={56}
                />
                <ChildButton
                    icon={
                        <MdFavorite
                        style={{ fontSize: 20 }}
                        nativeColor="black"
                    />
                    }
                    backgroundColor="white"
                    size={40}
                    onClick={() => history.push('/')}
                />
                <ChildButton
                    icon={
                        <Icon path={mdiBird}
                        size={1}
                        color="black"/>
                    }
                    backgroundColor="white"
                    size={40}
                    onClick={() => history.push('/flappy')}
                />
            </FloatingMenu>
        </div>
    );
};

export default NavBar;
