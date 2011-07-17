//
//  readUpViewController.m
//  readUp
//
//  Created by Jon Bardin on 7/16/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "readUpViewController.h"

@implementation readUpViewController


@synthesize mWebView;


- (void)dealloc
{
    [super dealloc];
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle


// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad
{
  [super viewDidLoad];

  [mWebView loadHTMLString:[NSString stringWithContentsOfURL:[[NSBundle mainBundle] URLForResource:@"result" withExtension:@"html" subdirectory:@"public"] encoding:NSUTF8StringEncoding error:nil] baseURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"public" ofType:nil]]];
  
  //[[mWebView.subviews objectAtIndex:0] setScrollEnabled:NO];  //to stop scrolling completely
  [[mWebView.subviews objectAtIndex:0] setBounces:NO]; //to stop bouncing
  [mWebView setScalesPageToFit:NO];
  [mWebView setBackgroundColor:[UIColor clearColor]];
  [mWebView setAllowsInlineMediaPlayback:YES];
  [mWebView setMediaPlaybackRequiresUserAction:NO];
  
}


- (void)willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
  switch (toInterfaceOrientation)
  {
    case UIDeviceOrientationPortrait:
      [mWebView stringByEvaluatingJavaScriptFromString:@"window.__defineGetter__('orientation',function(){return 0;});window.onorientationchange();"];
      break;
    case UIDeviceOrientationLandscapeLeft:
      [mWebView stringByEvaluatingJavaScriptFromString:@"window.__defineGetter__('orientation',function(){return 90;});window.onorientationchange();"];
      break;
    case UIDeviceOrientationLandscapeRight:
      [mWebView stringByEvaluatingJavaScriptFromString:@"window.__defineGetter__('orientation',function(){return -90;});window.onorientationchange();"];
      break;
    case UIDeviceOrientationPortraitUpsideDown:
      [mWebView stringByEvaluatingJavaScriptFromString:@"window.__defineGetter__('orientation',function(){return 180;});window.onorientationchange();"];
      break;
    default:
      break;
  }
}


- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return YES;
}


@end