//
//  readUpAppDelegate.h
//  readUp
//
//  Created by Jon Bardin on 7/16/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

@class readUpViewController;

@interface readUpAppDelegate : NSObject <UIApplicationDelegate> {

}

@property (nonatomic, retain) IBOutlet UIWindow *window;

@property (nonatomic, retain) IBOutlet readUpViewController *viewController;

@end
